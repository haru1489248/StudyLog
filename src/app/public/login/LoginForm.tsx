'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useActionState } from 'react'
import { toast } from 'react-toastify'

import { signIn } from '@/auth'
import { Button } from '@/components/atom/Button'
import { globalLoading } from '@/components/atom/global-loading'
import { InputLabel } from '@/components/molecules/InputLabel/InputLabel'

export const LoginForm = () => {
  const [state, dispatch] = useActionState(signIn, {
    status: 'idle',
    message: '',
  })
  const router = useRouter()

  React.useEffect(() => {
    if (!state) {
      return
    }

    if (state.status === 'success') {
      ;(async () => {
        if (state.message) {
          toast.success(state.message)
        }
        globalLoading.hide()
        router.push(`/private`)
      })()
    }

    if (state.status === 'error') {
      toast.error(state.message)
      globalLoading.hide()
    }
  }, [state, state?.status, router])

  return (
    <div className='flex flex-col justify-center'>
      <div className='w-full flex justify-center'>
        <div className='max-7xl flex flex-col items-center justify-center mt-[10vh] max-w-[400px]'>
          <div className='flex flex-col gap-1 mb-12'>
            <div className='font-medium text-3xl'>StudyLog 学習管理アプリ</div>
            <div className='font-medium text-2xl text-gray-500'>ログインして続行</div>
          </div>
          <form
            action={async (formData: FormData) => {
              globalLoading.show()
              await dispatch(formData)
            }}
            className='w-full flex flex-col gap-4'
          >
            <InputLabel
              label='メールアドレス'
              id='email'
              type='email'
              name='email'
              autoComplete='email'
              placeholder='メールアドレスを入力してください...'
              required
            />

            <InputLabel
              label='パスワード'
              id='password'
              type='password'
              name='password'
              autoComplete='password'
              placeholder='パスワードを入力してください...'
              required
            />

            <Button type='submit' variant='primary' className='mt-8'>
              ログイン
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
