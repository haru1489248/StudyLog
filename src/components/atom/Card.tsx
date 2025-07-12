type CardProps = {
  children: React.ReactNode
  className?: string
}

export const Card = ({ children, className }: CardProps) => {
  return (
    <div className={`bg-white rounded-md p-4 shadow-md ${className}`}>{children}</div>
  )
}
