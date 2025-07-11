import React from 'react'

type LabelProps = {
  htmlFor: string
  children: React.ReactNode
  className?: string
  srOnly?: boolean
}

export const Label = ({
  htmlFor,
  children,
  className = '',
  srOnly = false,
}: LabelProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm text-gray-900 ${srOnly ? 'sr-only' : ''} ${className}`}
    >
      {children}
    </label>
  )
}
