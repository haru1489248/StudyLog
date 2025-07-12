'use client'

import { useState } from 'react'
import { CiCalendar } from 'react-icons/ci'
import { IoIosArrowForward } from 'react-icons/io'

import { Button } from '@/components/atom/Button'
import { Card } from '@/components/atom/Card'
import { ProgressBar } from '@/components/atom/ProgressBar'

import { RoadMap } from './RoadMap'

export const GoalDisplay = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className='w-[632px]'>
      <div className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <IoIosArrowForward
            className={`text-gray-500 transition-transform duration-300 cursor-pointer ${isOpen ? 'rotate-90' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
          />
          <h2 className='text-lg font-bold'>目標名</h2>
        </div>
        <div className='flex justify-end'>
          <div
            className='bg-blue-100 rounded-full text-blue-500 border border-blue-500 text-xs px-2 py-1'
            onClick={() => setIsOpen(!isOpen)}
          >
            進捗中
          </div>
        </div>
      </div>
      <div className='mt-2 ml-6'>
        <p className='text-gray-500 text-md'>目標内容</p>
        <div className='flex items-center gap-2 text-gray-500 text-sm'>
          <CiCalendar />
          <p>
            期限：<span>2025/01/01</span>
          </p>
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
        <Button variant='detail'>詳細・編集</Button>
      </div>
    </Card>
  )
}
