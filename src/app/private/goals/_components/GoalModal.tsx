'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/atom/Button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/atom/Dialog'
import { DatePicker } from '@/components/molecules/DatePicker'
import { InputLabel } from '@/components/molecules/InputLabel'
import { useCreateGoal } from '@/entities/goal/hooks/use-goal'

type FormValues = {
  title: string
  description: string
  planStartDate?: Date
  plannedEndDate?: Date
}

export const GoalModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
    },
  })

  const { mutate: createGoal, isPending: isCreatingGoal } = useCreateGoal()

  const onSubmit = async (data: FormValues) => {
    createGoal(
      {
        title: data.title,
        description: data.description,
        planStartDate: data.planStartDate || new Date(),
        planEndDate: data.plannedEndDate || new Date(),
        userId: '', // サーバー側で自動設定される
      },
      {
        onSuccess: () => {
          setIsOpen(false)
          reset() // フォームをリセット
        },
      },
    )
  }

  const handleClose = () => {
    setIsOpen(false)
    reset() // フォームをリセット
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>追加</Button>
      </DialogTrigger>
      <DialogContent className='shadow-lg'>
        <DialogHeader>
          <DialogTitle>目標を追加</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputLabel
            label='タイトル'
            id='title'
            errorMessage={errors.title?.message}
            required
            {...register('title', { required: 'タイトルは必須です' })}
          />
          <InputLabel
            label='説明'
            id='description'
            inputType='textarea'
            className='mt-4'
            errorMessage={errors.description?.message}
            required
            {...register('description', { required: '説明は必須です' })}
          />
          <DatePicker label='開始予定日' className='mt-4' name='planStartDate' />
          <DatePicker label='終了予定日' className='mt-4' name='plannedEndDate' />
        </form>
        <DialogFooter
          className='flex justify-between p-4 -mx-8 px-8 -mb-5 pb-5'
          style={{ boxShadow: '0 -4px 12px -4px rgba(0,0,0,0.10)' }}
        >
          <Button variant='destructive' onClick={handleClose}>
            キャンセル
          </Button>
          <Button
            variant='primary'
            onClick={handleSubmit(onSubmit)}
            disabled={isCreatingGoal}
          >
            {isCreatingGoal ? '処理中...' : '追加'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
