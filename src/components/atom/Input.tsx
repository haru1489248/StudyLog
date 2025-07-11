import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'
import { Control, Controller } from 'react-hook-form'
import { NumericFormat, NumericFormatProps } from 'react-number-format'

import { cn } from '@/utils'

const inputContainerVariants = cva(
  'flex w-full rounded-md border border-input border-gray-300 bg-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
  {
    variants: {
      inputSize: {
        sm: 'h-8 px-2 py-1 text-sm',
        default: 'h-[34px] px-3 py-1 text-sm',
        lg: 'h-11 px-4 py-2 text-base',
        xl: 'h-14 px-4 py-[10px] text-lg',
      },
    },
    defaultVariants: {
      inputSize: 'default',
    },
  },
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputContainerVariants> {
  /** Optional icon to be displayed inside the input box on the left side. */
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, inputSize = 'default', icon, ...props }, ref) => {
    if (icon) {
      return (
        <div
          className={cn(
            inputContainerVariants({ inputSize }),
            props.disabled && 'cursor-not-allowed opacity-50 pointer-events-none',
            className,
            'items-center',
          )}
        >
          {icon && (
            <span
              className='mr-2 flex items-center text-muted-foreground'
              aria-hidden='true'
            >
              {icon}
            </span>
          )}
          <input
            ref={ref}
            type={type}
            className='bg-transparent border-0 p-0 m-0 flex-1 focus:outline-none focus-visible:ring-0'
            {...props}
          />
        </div>
      )
    }

    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          inputContainerVariants({ inputSize }),
          props.disabled && 'cursor-not-allowed opacity-50 pointer-events-none',
          className,
          'items-center',
        )}
        {...props}
      />
    )
  },
)

Input.displayName = 'Input'
export { Input }

export const NumericInput = (
  props: NumericFormatProps &
    VariantProps<typeof inputContainerVariants> & { icon?: React.ReactNode },
) => {
  const { ...restProps } = props
  return <NumericFormat customInput={Input} thousandSeparator={true} {...restProps} />
}

export const FormNumericInput = (
  props: NumericFormatProps &
    VariantProps<typeof inputContainerVariants> & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      control: Control<any>
      icon?: React.ReactNode
    },
) => {
  const { control, ...restProps } = props

  return (
    <Controller
      name={props.id!}
      control={control}
      render={({ field }) => (
        <NumericFormat
          customInput={Input}
          thousandSeparator={true}
          {...field}
          {...restProps}
          onChange={(e) => {
            const rawValue = e.target.value
              // Remove the prefix if you use one
              .replaceAll('Rp. ', '')
              // Remove commas
              .replaceAll(',', '')

            const numericValue = Number(rawValue)

            if (numericValue !== field.value) {
              field.onChange(numericValue)
            }
          }}
        />
      )}
    />
  )
}

export const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  inputSize = 'default',
  className,
  icon,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
  icon?: React.ReactNode
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> &
  VariantProps<typeof inputContainerVariants>) => {
  const [value, setValue] = React.useState(initialValue)
  const [isDebouncing, setIsDebouncing] = React.useState(false)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    if (value === initialValue) {
      setIsDebouncing(false)
      return
    }

    setIsDebouncing(true)
    const timeout = setTimeout(() => {
      onChange(value)
      setIsDebouncing(false)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, initialValue, debounce, onChange])

  // Loading spinner element
  const loadingSpinner = (
    <span className='animate-spin text-muted-foreground'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M21 12a9 9 0 1 1-6.219-8.56' />
      </svg>
    </span>
  )

  // Conditionally show either the loading spinner or the original icon
  const displayIcon = isDebouncing ? loadingSpinner : icon

  return (
    <Input
      inputSize={inputSize}
      className={className}
      icon={displayIcon}
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}
