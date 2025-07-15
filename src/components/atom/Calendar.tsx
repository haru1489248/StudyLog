'use client'

import { enUS, ja } from 'date-fns/locale'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'

type Locale = 'ja' | 'en-US'

export const Calendar = ({
  selected,
  onSelect,
  className,
  captionLayout,
  month,
  onMonthChange,
  locale = 'ja',
}: {
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  className?: string
  captionLayout?: 'dropdown' | 'label' | 'dropdown-months' | 'dropdown-years'
  month?: Date
  onMonthChange?: (date: Date) => void
  locale?: Locale
}) => {
  return (
    <DayPicker
      mode='single'
      //localeに渡すのはenUSでないといけないがtoLocalDateStringに渡すのはen-US
      locale={locale === 'ja' ? ja : enUS}
      selected={selected}
      onSelect={onSelect}
      className={className}
      captionLayout={captionLayout}
      month={month}
      onMonthChange={onMonthChange}
      footer={
        selected
          ? `${locale === 'ja' ? '選択日: ' : 'Selected: '}${selected.toLocaleDateString(locale)}`
          : `${locale === 'ja' ? '日付を選択' : 'Select a date'}`
      }
    />
  )
}
