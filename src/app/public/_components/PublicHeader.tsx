import { FiBookOpen } from 'react-icons/fi'

export const PublicHeader = () => {
  return (
    <div className='flex justify-between items-center p-4 ml-4'>
      <div className='flex items-center gap-2'>
        <FiBookOpen className='text-5xl text-blue-600' />
        <h1 className='text-2xl font-black'>StudyLog</h1>
      </div>
    </div>
  )
}
