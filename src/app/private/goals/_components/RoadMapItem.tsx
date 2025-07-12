import { Button } from '@/components/atom/Button'
import { useState } from 'react'
import { AiOutlineCheckCircle } from 'react-icons/ai'

export const RoadMapItem = ({
  item,
}: {
  item: {
    title: string
    description: string
    scheduleTime: string
    actualTime: string | null
    isCompleted: boolean
  }
}) => {
  const [isCompleted, setIsCompleted] = useState(item.isCompleted)
  return (
      <div className='flex justify-between gap-2'>
        <div className='flex items-center gap-2'>
        {isCompleted ? (
          <AiOutlineCheckCircle
            className='bg-green-500 rounded-full text-white text-xm cursor-pointer'
            onClick={() => {
              setIsCompleted(false)
            }}
          />
        ) : (
          <div
            className='w-4 h-4 rounded-full border border-gray-300 cursor-pointer'
            onClick={() => {
              setIsCompleted(true)
            }}
          />
        )}
        <div className='flex flex-col'>
          <p className='text-sm'>{item.title}</p>
          <div className='flex items-center gap-2'>
            <p className='text-xs text-gray-500'>予定：{item.scheduleTime}</p>
            {item.actualTime && (
              <>
                <span className='text-xs text-gray-500'>/</span>
                <p className='text-xs text-gray-500'>実際：{item.actualTime}</p>
              </>
            )}
          </div>
        </div>
        </div>
        <div className='flex items-center gap-2'>
        {isCompleted ? (
            <Button variant='primary'>記事作成</Button>
        ) : (
            <Button variant='detail'>詳細・編集</Button>
        )}
        </div>
      </div>
  )
}
