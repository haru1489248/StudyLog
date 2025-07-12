import { PrivateHeader } from "./_components/PrivateHeader"

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <PrivateHeader />
      {children}
    </div>
  )
}
