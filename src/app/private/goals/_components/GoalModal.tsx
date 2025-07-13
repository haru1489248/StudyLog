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
import { useState } from 'react'

export const GoalModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>追加</Button>
      </DialogTrigger>
      <DialogContent className='shadow-lg'>
        <DialogHeader>
          <DialogTitle>目標を追加</DialogTitle>
        </DialogHeader>
        <form>
          <div>
            <InputLabel label='タイトル' id='title' name='title' />
            <InputLabel
              label='説明'
              id='description'
              name='description'
              inputType='textarea'
              className='mt-4'
            />
            <DatePicker label='開始予定日' className='mt-4' name='planStartDate' />
            <DatePicker label='終了予定日' className='mt-4' name='plannedEndDate' />
          </div>
        </form>
        <DialogFooter
          className='flex justify-between p-4 -mx-8 px-8 -mb-5 pb-5'
          style={{ boxShadow: '0 -4px 12px -4px rgba(0,0,0,0.10)' }}
        >
          <Button variant='destructive' onClick={() => setIsOpen(false)}>
            キャンセル
          </Button>
          <Button variant='primary'>追加</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
