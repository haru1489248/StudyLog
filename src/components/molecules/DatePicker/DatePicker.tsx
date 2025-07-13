'use client'

import { CalendarIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/atom/Button'
import { Calendar } from '@/components/atom/Calendar'
import { Input } from '@/components/atom/Input'
import { Label } from '@/components/atom/Label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/atom/Popover'
import { cn } from '@/utils'

type LocaleType = 'ja' | 'en'

const formatMap = {
  ja: (date: Date) =>
    date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    }),
  en: (date: Date) =>
    date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    }),
}

type DatePickerProps = {
  label: string
  locale?: LocaleType
  className?: string
  name: string
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, locale = 'ja', className, ...props }, ref) => {
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    const [month, setMonth] = React.useState<Date | undefined>(date)
    const [value, setValue] = React.useState(date ? formatMap[locale](date) : '')

    React.useEffect(() => {
      setValue(date ? formatMap[locale](date) : '')
    }, [date, locale])

    function isValidDate(date: Date | undefined) {
      if (!date) return false
      return !isNaN(date.getTime())
    }

    return (
      <div className={cn('flex flex-col gap-3', className)}>
        <Label htmlFor='date' className='px-1'>
          {label}
        </Label>
        <div className='relative w-full'>
          <Input
            id='date'
            ref={ref}
            value={value}
            placeholder={locale === 'ja' ? '2025年6月1日' : 'June 01, 2025'}
            className='bg-background pr-12'
            onChange={(e) => {
              const date = new Date(e.target.value)
              setValue(e.target.value)
              if (isValidDate(date)) {
                setDate(date)
                setMonth(date)
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setOpen(true)
              }
            }}
            {...props}
          />
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='absolute inset-y-0 right-2 my-auto text-stone-500 hover:text-stone-700'
              >
                <CalendarIcon className='size-3.5' />
                <span className='sr-only'>
                  {locale === 'ja' ? '日付を選択' : 'Select date'}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className='z-50 w-auto overflow-hidden p-0'
              align='end'
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                selected={date}
                captionLayout='dropdown'
                month={month}
                onMonthChange={setMonth}
                onSelect={(date) => {
                  setDate(date)
                  setValue(date ? formatMap[locale](date) : '')
                  setOpen(false)
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    )
  },
)
DatePicker.displayName = 'DatePicker'
