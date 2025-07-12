import React from 'react'

type ButtonProps = {
  type?: 'button' | 'submit' | 'reset'
  children: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'warning' | 'detail'
}

export const Button = ({
  type = 'button',
  children,
  onClick,
  className = '',
  disabled = false,
  variant = 'secondary',
}: ButtonProps) => {
  const baseStyles =
    'group relative flex justify-center py-2 px-4 border text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variantStyles = {
    primary:
      'text-green-600 font-bold bg-green-100 border-green-400 hover:bg-green-300 focus:ring-green-300',
    secondary:
      'border-transparent font-medium text-stone-800 bg-stone-200 hover:bg-stone-300 focus:ring-stone-400',
    outline:
      'border-stone-300 font-medium text-stone-800 bg-white hover:bg-stone-50 focus:ring-stone-500',
    danger:
      'border-transparent font-medium text-white bg-red-700 hover:bg-red-800 focus:ring-red-600',
    warning:
      'border-transparent font-medium text-stone-800 bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    detail: 'border-none font-medium text-blue-600 hover:text-blue-700',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
