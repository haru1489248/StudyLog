import * as React from 'react'

import { cn } from '@/utils'

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)

Textarea.displayName = 'Textarea'

export const DebouncedTextarea = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string
  onChange: (value: string) => void
  debounce?: number
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'>) => {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, onChange, debounce])

  return <Textarea {...props} value={value} onChange={(e) => setValue(e.target.value)} />
}
