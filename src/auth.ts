'use server'

import bcrypt from 'bcrypt'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import prisma from '@/framework/xprisma'
import { User, UserRole } from '@prisma/client'

// セッションとトークンの型定義を拡張
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role: UserRole
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    role: UserRole
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
  }
}

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

export const {
  auth,
  signIn: authSignIn,
  signOut: authSignOut,
} = NextAuth({
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
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
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          const user = await getUser(email)

          if (!user || !user.password) {
            return null
          }

          const passwordsMatch = await bcrypt.compare(password, user.password)

          if (passwordsMatch) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            }
          }
        }

        return null
      },
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
    await authSignIn('credentials', formData)
    return {
      status: 'success',
      message: 'サインインに成功しました。',
    }
  } catch (error) {
    console.error('Failed to sign in:', error)

    // エラーの型を確認
    if (error && typeof error === 'object' && 'type' in error) {
      const authError = error as { type: string }

      switch (authError.type) {
        case 'CredentialsSignin':
          return {
            status: 'error',
            message: 'メールアドレスまたはパスワードが間違っています。',
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
