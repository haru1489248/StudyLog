import { PrivateHeader } from './_components/PrivateHeader'

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='h-screen flex flex-col'>
      <PrivateHeader />
      <div className='bg-gray-50 flex-1 overflow-auto'>{children}</div>
    </div>
  )
}
