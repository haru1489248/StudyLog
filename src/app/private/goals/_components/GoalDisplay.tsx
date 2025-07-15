'use client'

import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { CiCalendar } from 'react-icons/ci'
import { IoIosArrowForward } from 'react-icons/io'

import { Button } from '@/components/atom/Button'
import { Card } from '@/components/atom/Card'
import { ProgressBar } from '@/components/atom/ProgressBar'
import { useFetchGoals } from '@/entities/goal/hooks/use-goal'

import { RoadMap } from './RoadMap'

export const GoalDisplay = () => {
  const [isOpen, setIsOpen] = useState(false)

  const { data: goals, isLoading, isError } = useFetchGoals({ enabled: true })

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-full'>
        <Loader2 className='animate-spin' size={24} />
      </div>
    )
  } else if (isError) {
    return (
      <div className='flex justify-center items-center h-full'>
        <h2 className='text-lg font-bold'>エラーが発生しました</h2>
      </div>
    )
  } else if (goals?.length === 0) {
    return (
      <div className='flex justify-center items-center h-full'>
        <h2 className='text-lg font-bold'>目標がありません</h2>
      </div>
    )
  } else {
    return (
      <div className='flex flex-col gap-4'>
        {goals?.map((goal) => (
          <Card key={goal.id} className='w-[632px]'>
            <div className='flex items-center justify-between gap-2'>
              <div className='flex items-center gap-2'>
                <IoIosArrowForward
                  className={`text-gray-500 transition-transform duration-300 cursor-pointer ${isOpen ? 'rotate-90' : ''}`}
                  onClick={() => setIsOpen(!isOpen)}
                />
                <h2 className='text-lg font-bold'>{goal.title}</h2>
              </div>
              <div className='flex justify-end'>
                <div
                  className='bg-blue-100 rounded-full text-blue-500 border border-blue-500 text-xs px-2 py-1 whitespace-nowrap'
                  onClick={() => setIsOpen(!isOpen)}
                >
                  進捗中
                </div>
              </div>
            </div>
            <div className='mt-2 ml-6'>
              <p className='text-gray-500 text-md'>{goal.description}</p>
              <div className='flex items-center gap-2 text-gray-500 text-sm'>
                <div className='flex items-center gap-2'>
                  <CiCalendar />
                  <p>
                    開始：<span>{goal.planStartDate.toLocaleDateString()}</span>
                  </p>
                </div>
                <div className='flex items-center gap-2'>
                  <CiCalendar />
                  <p>
                    終了：<span>{goal.planEndDate.toLocaleDateString()}</span>
                  </p>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='bg-blue-100 rounded-full text-blue-500 border border-blue-500 text-xs px-2'>
                    タグ
                  </div>
                  <div className='bg-blue-100 rounded-full text-blue-500 border border-blue-500 text-xs px-2'>
                    タグ
                  </div>
                </div>
              </div>
            </div>
            <div className='mt-2'>
              <p className='text-sm mb-2'>進捗状況</p>
              <ProgressBar />
            </div>
            {isOpen && (
              <div className='mt-4 mx-4'>
                <RoadMap />
              </div>
            )}
            <hr className='my-4' />
            <div className='flex justify-end'>
              <Button variant='link'>詳細・編集</Button>
            </div>
          </Card>
        ))}
      </div>
    )
  }
}
