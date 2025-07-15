import * as React from 'react'

import { Input, InputProps, NumericInput } from '@/components/atom/Input'
import { Label } from '@/components/atom/Label'
import { Textarea } from '@/components/atom/Textarea'
import { cn } from '@/utils'

interface InputLabelProps extends InputProps {
  label: string
  id: string
  description?: string
  errorMessage?: string

  inputType?: 'textarea' | 'numeric' | 'date'
}

export const InputLabel = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputLabelProps
>(
  (
    { label, id, description, errorMessage, className, inputType, required, ...props },
    ref,
  ) => {
    // Combine description and error for aria-describedby
    const describedByIds: string[] = []
    if (description) describedByIds.push(`${id}-description`)
    if (errorMessage) describedByIds.push(`${id}-error`)
    const describedBy = describedByIds.length > 0 ? describedByIds.join(' ') : undefined

    return (
      <div className={cn('flex flex-col gap-1 w-full', className)}>
        <Label htmlFor={id} className='mb-1'>
          {label} {required && <span className='text-red-500'>（必須）</span>}
        </Label>
        {inputType === 'numeric' && (
          // @ts-expect-error - NumericInput is not defined in the current file
          <NumericInput
            id={id}
            aria-describedby={describedBy}
            aria-invalid={Boolean(errorMessage) || undefined}
            {...props}
          />
        )}

        {inputType === 'textarea' && (
          <Textarea
            id={id}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            aria-describedby={describedBy}
            aria-invalid={Boolean(errorMessage) || undefined}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        )}

        {!inputType && (
          <Input
            id={id}
            ref={ref as React.Ref<HTMLInputElement>}
            aria-describedby={describedBy}
            aria-invalid={Boolean(errorMessage) || undefined}
            {...props}
          />
        )}
        {description && (
          <div id={`${id}-description`} className='text-sm text-gray-400'>
            {description}
          </div>
        )}
        {errorMessage && (
          <div id={`${id}-error`} className='text-sm text-red-600'>
            {errorMessage}
          </div>
        )}
      </div>
    )
  },
)

InputLabel.displayName = 'InputLabel'
