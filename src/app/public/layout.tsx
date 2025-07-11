import { PublicHeader } from './_components/PublicHeader'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <PublicHeader />

      {children}
    </div>
  )
}
