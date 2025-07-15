'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaBlog } from 'react-icons/fa6'
import { FiBookOpen } from 'react-icons/fi'
import { IoSettingsOutline } from 'react-icons/io5'
import { LuGoal } from 'react-icons/lu'
import { MdOutlineDashboard } from 'react-icons/md'

import { GoalModal } from '../goals/_components/GoalModal'

export const PrivateHeader = () => {
  const pathname = usePathname()
  const isGoal = pathname.includes('/private/goals')

  const icons = [
    {
      name: 'ダッシュボード',
      icon: <MdOutlineDashboard className='text-2xl' />,
      href: '/private',
    },
    {
      name: '記事一覧',
      icon: <FaBlog className='text-2xl' />,
      href: '/private/articles',
    },
    {
      name: '目標管理',
      icon: <LuGoal className='text-2xl' />,
      href: '/private/goals',
    },
    {
      name: '設定',
      icon: <IoSettingsOutline className='text-2xl' />,
      href: '/private/settings',
    },
  ]
  return (
    <div className='flex items-center p-4 mx-4 gap-4 justify-between'>
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <FiBookOpen className='text-5xl text-blue-600' />
          <h1 className='text-2xl font-black'>StudyLog</h1>
        </div>
        {icons.map((icon) => {
          const isActive = pathname === icon.href
          return (
            <div key={icon.href} className='ml-2'>
              <Link
                href={icon.href}
                className={`flex items-center gap-2 p-2 ${isActive ? 'text-blue-600 bg-gray-100 rounded-md' : 'text-gray-500'}`}
              >
                {icon.icon}
                {icon.name}
              </Link>
            </div>
          )
        })}
      </div>
      <div className='flex items-center gap-2'>{isGoal && <GoalModal />}</div>
    </div>
  )
}
