import { GiProgression } from 'react-icons/gi'
import { GoGoal } from 'react-icons/go'
import { PiSealCheckFill } from 'react-icons/pi'

import { Card } from '@/components/atom/Card'

import { GoalDisplay } from './_components/GoalDisplay'

export default function GoalsPage() {
  const cardSections = [
    {
      title: '総目標数',
      value: '10',
      icon: <GoGoal />,
      color: 'text-orange-500',
    },
    {
      title: '完了済み',
      value: '5個',
      icon: <PiSealCheckFill />,
      color: 'text-green-500',
    },
    {
      title: '進捗率',
      value: '10%',
      icon: <GiProgression />,
      color: 'text-blue-500',
    },
  ]
  return (
    <div className='p-4 mx-4'>
      <h1 className='text-2xl font-bold mb-2'>学習目標管理</h1>
      <p className='text-gray-500'>学習目標を設定し、学習の進捗を管理しましょう。</p>
      <div className='mt-4'>
        <div className='flex gap-4'>
          {cardSections.map((section) => (
            <Card className='w-[200px]' key={section.title}>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-500'>{section.title}</p>
                  <p className='text-2xl font-bold'>{section.value}</p>
                </div>
                <div className={`${section.color} bg-gray-100 rounded-full p-2`}>
                  {section.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className='mt-4'>
          <GoalDisplay />
        </div>
      </div>
    </div>
  )
}
