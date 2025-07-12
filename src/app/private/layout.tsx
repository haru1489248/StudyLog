import { PrivateHeader } from './_components/PrivateHeader'

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <PrivateHeader />
      <div className='bg-gray-50 h-screen'>{children}</div>
    </div>
  )
}
