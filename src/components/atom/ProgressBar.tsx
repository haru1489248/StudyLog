'use client'

import { useMemo } from 'react'

export const ProgressBar = () => {
  const goal = 100
  const completed = 60

  const progressPercent = useMemo(() => {
    return (completed / goal) * 100
  }, [completed, goal])

  return (
    <div className='w-full h-2 bg-gray-200 rounded-full'>
      <div
        className='h-full bg-blue-500 rounded-full'
        style={{ width: `${progressPercent}%` }}
      />
    </div>
  )
}
