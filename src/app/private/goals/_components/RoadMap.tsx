import { RoadMapItem } from './RoadMapItem'

export const RoadMap = () => {
  const roadMapItems = [
    {
      title: 'ステップ1: 基礎学習',
      description: '学習目標を達成するためのステップを示します。',
      scheduleTime: '6時間',
      actualTime: '4時間',
      isCompleted: false,
    },
    {
      title: 'ステップ2: 実践演習',
      description: '学習目標を達成するためのステップを示します。',
      scheduleTime: '3時間',
      actualTime: null,
      isCompleted: true,
    },
    {
      title: 'ステップ3: 応用開発',
      description: '学習目標を達成するためのステップを示します。',
      scheduleTime: '2時間',
      actualTime: '3時間',
      isCompleted: false,
    },
  ]
  return (
    <div className='border border-gray-200 rounded-md p-4'>
      <h3 className='text-md font-semibold mb-2'>ロードマップ</h3>
      <p className='text-sm text-gray-500 mb-2'>
        学習目標を達成するためのステップを示します。
      </p>
      <div className='mt-4'>
        <div className='flex flex-col gap-4'>
          {roadMapItems.map((item) => (
            <RoadMapItem key={item.title} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}
