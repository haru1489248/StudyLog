'use server'

import bcrypt from 'bcrypt'
import NextAuth, { AuthError } from 'next-auth'
import Auth0 from 'next-auth/providers/auth0'
import Credentials from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import prisma from '@/framework/xprisma'
import { User, UserRole } from '@prisma/client'

async function getUser(email: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    return user
  } catch (error) {
    console.error(error)
    throw new Error('Failed to fetch user.')
  }
}

// OAuthアカウントからユーザーを作成または取得
async function getOrCreateUser(profile: {
  email: string
  name?: string
  login?: string
}) {
  try {
    let user = await prisma.user.findUnique({
      where: { email: profile.email },
    })

    if (!user) {
      // 新規ユーザーを作成
      user = await prisma.user.create({
        data: {
          email: profile.email,
          name: profile.name || profile.login,
          role: UserRole.USER, // デフォルトロール
          // OAuthアカウントの場合はパスワードを設定しない
        },
      })
    }

    return user
  } catch (error) {
    console.error('Failed to get or create user:', error)
    throw new Error('Failed to get or create user.')
  }
}

export const {
  auth,
  signIn: authSignIn,
  signOut: authSignOut,
} = NextAuth({
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        if ('role' in user) token.role = (user as { role: UserRole }).role
      }
      return token
    },
    session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string
        if ('role' in token) session.user.role = (token as { role: UserRole }).role
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'credentials') {
        return true // 既存のクレデンシャル認証
      }

      // OAuth認証の場合
      if (account && profile && profile.email) {
        try {
          const dbUser = await getOrCreateUser({
            email: profile.email,
            name: profile.name || undefined,
            login: (profile as { login?: string }).login,
          })
          user.id = dbUser.id
          if ('role' in dbUser) user.role = (dbUser as { role: UserRole }).role
          return true
        } catch (error) {
          console.error('OAuth sign in error:', error)
          return false
        }
      }

      return true
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email('有効なメールアドレスを入力してください'),
            password: z.string().min(6, 'パスワードは6文字以上で入力してください')
          })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          let user = await getUser(email)

          if (!user) {
            // ユーザーが存在しない場合は作成
            try {
              const hashedPassword = await bcrypt.hash(password, 12)
              user = await prisma.user.create({
                data: {
                  email,
                  password: hashedPassword,
                  role: UserRole.USER,
                },
              })
            } catch (error) {
              console.error('Failed to create user:', error)
              return null
            }
          } else if (!user.password) {
            // OAuthユーザーの場合はパスワードを設定
            const hashedPassword = await bcrypt.hash(password, 12)
            user = await prisma.user.update({
              where: { id: user.id },
              data: { password: hashedPassword },
            })
          } else {
            // 既存ユーザーの場合はパスワードをチェック
            const passwordsMatch = await bcrypt.compare(password, user.password)
            if (!passwordsMatch) {
              return null
            }
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        }

        return null
      },
    }),
    // Auth0を使用することでTwitter APIの有料化を回避
    Auth0({
      clientId: process.env.AUTH0_ID!,
      clientSecret: process.env.AUTH0_SECRET!,
      issuer: process.env.AUTH0_ISSUER!,
    }),
    // GitHub認証（直接プロバイダー）
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // Google認証（直接プロバイダー）
    Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
})

export type DefaultActionFunctionReturn = {
  status: 'idle' | 'success' | 'error'
  message: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
}

export type DefaultActionFormFunction = (
  prevState: { status: 'idle' | 'success' | 'error'; message: string } | undefined,
  formData: FormData,
) => Promise<DefaultActionFunctionReturn>

export const signIn: DefaultActionFormFunction = async (prevState, formData) => {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // ユーザーが存在するかチェック（新規作成かどうかを判定）
    const existingUser = await getUser(email)
    const isNewUser = !existingUser

    await authSignIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (isNewUser) {
      return {
        status: 'success',
        message: 'アカウントが新しく作成されました。',
      }
    } else {
      return {
        status: 'success',
        message: '', // ログインの場合は何も表示しない
      }
    }
  } catch (error) {
    if (error instanceof AuthError) {
      console.error('Failed to sign in:', error)

      switch (error.type) {
        case 'CredentialsSignin':
          return {
            status: 'error',
            message: 'ユーザー名またはパスワードが間違っています。',
          }
        default:
          return {
            status: 'error',
            message: 'エラーが発生しました。',
          }
      }
    }

    return {
      status: 'error',
      message: 'サインイン中にエラーが発生しました。',
    }
  }
}

export const signOut = async (): Promise<DefaultActionFunctionReturn> => {
  try {
    const data = await authSignOut({
      redirect: false,
      redirectTo: '/',
    })

    revalidatePath('/')

    return {
      status: 'success',
      message: 'サインアウトに成功しました。',
      data: { url: data?.url || '/' },
    }
  } catch (error) {
    console.error('Failed to sign out:', error)

    // エラーの型を確認
    if (error && typeof error === 'object' && 'type' in error) {
      const authError = error as { type: string }

      switch (authError.type) {
        case 'CredentialsSignin':
          return {
            status: 'error',
            message: '認証情報が無効です。',
          }
        default:
          return {
            status: 'error',
            message: '問題が発生しました。',
          }
      }
    }

    return {
      status: 'error',
      message: 'サインアウト中にエラーが発生しました。',
      data: { url: '/' },
    }
  }
}
