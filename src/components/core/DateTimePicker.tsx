'use client'

import * as React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CalendarIcon } from '@radix-ui/react-icons'
import {
  endOfHour,
  endOfMinute,
  format,
  parse,
  getMonth,
  getYear,
  setHours,
  setMinutes,
  setMonth as setMonthFns,
  setSeconds,
  setYear,
  startOfHour,
  startOfMinute,
  startOfYear,
  startOfMonth,
  endOfMonth,
  endOfYear,
  addMonths,
  subMonths,
  setMilliseconds,
  addHours,
  subHours,
  startOfDay,
  endOfDay
} from 'date-fns'
import { vi, Locale } from 'date-fns/locale'
import { CheckIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, Clock } from 'lucide-react'
import { DayPicker, Matcher, TZDate } from 'react-day-picker'

import { cn } from '@/libraries/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useTranslation } from 'react-i18next'

export type CalendarProps = Omit<React.ComponentProps<typeof DayPicker>, 'mode'>

const AM_VALUE = 0
const PM_VALUE = 1

export type DateTimePickerProps = {
  value: Date | undefined
  onChange: (date: Date) => void
  min?: Date
  max?: Date
  timezone?: string
  disabled?: boolean
  showTime?: boolean
  use12HourFormat?: boolean
  renderTrigger?: (props: DateTimeRenderTriggerProps) => React.ReactNode
  className?: string
}

export type DateTimeRenderTriggerProps = {
  value: Date | undefined
  open: boolean
  timezone?: string
  disabled?: boolean
  use12HourFormat?: boolean
}

export const DateTimePicker = React.forwardRef<HTMLDivElement, DateTimePickerProps & CalendarProps>(
  (
    {
      value,
      onChange,
      renderTrigger,
      min,
      max,
      timezone,
      showTime = false,
      use12HourFormat = true,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const { i18n, t } = useTranslation()
    const locale = i18n.language === 'vi' ? vi : undefined

    const [open, setOpen] = useState(false)
    const [monthYearPicker, setMonthYearPicker] = useState<'month' | 'year' | false>(false)
    const initDate = useMemo(() => new TZDate(value || new Date(), timezone), [value, timezone])

    const [month, setMonth] = useState<Date>(initDate)
    const [date, setDate] = useState<Date>(initDate)

    const endMonth = useMemo(() => {
      return setYear(month, getYear(month) + 1)
    }, [month])
    const minDate = useMemo(() => (min ? new TZDate(min, timezone) : undefined), [min, timezone])
    const maxDate = useMemo(() => (max ? new TZDate(max, timezone) : undefined), [max, timezone])

    const onDayChanged = useCallback(
      (d: Date) => {
        d.setHours(date.getHours(), date.getMinutes(), date.getSeconds())
        if (min && d < min) {
          d.setHours(min.getHours(), min.getMinutes(), min.getSeconds())
        }
        if (max && d > max) {
          d.setHours(max.getHours(), max.getMinutes(), max.getSeconds())
        }
        setDate(d)
      },
      [date, setDate, min, max]
    )
    const onSubmit = useCallback(() => {
      onChange(new Date(date))
      setOpen(false)
    }, [date, onChange])

    const onMonthYearChanged = useCallback(
      (d: Date, mode: 'month' | 'year') => {
        setMonth(d)
        if (mode === 'year') {
          setMonthYearPicker('month')
        } else {
          setMonthYearPicker(false)
        }
      },
      [setMonth, setMonthYearPicker]
    )
    const onNextMonth = useCallback(() => {
      setMonth(addMonths(month, 1))
    }, [month])
    const onPrevMonth = useCallback(() => {
      setMonth(subMonths(month, 1))
    }, [month])

    useEffect(() => {
      if (open) {
        setDate(initDate)
        setMonth(initDate)
        setMonthYearPicker(false)
      }
    }, [open, initDate])

    const displayValue = useMemo(() => {
      if (!open && !value) return value
      return open ? date : initDate
    }, [date, value, open])

    const getPickDateText = () => {
      return i18n.language === 'vi' ? 'Chọn ngày' : 'Pick a date'
    }

    const displayFormat = useMemo(() => {
      if (!displayValue) return getPickDateText()
      const formatOptions = { locale }

      if (showTime) {
        if (use12HourFormat) {
          if (i18n.language === 'vi') {
            const day = format(displayValue, 'd')
            const month = format(displayValue, 'M')
            const year = format(displayValue, 'yyyy')
            const time = format(displayValue, 'hh:mm:ss a')
            return `${day} Tháng ${month}, ${year}, ${time}`
          }
          return format(displayValue, 'MMM d, yyyy, hh:mm:ss a', { locale })
        } else {
          if (i18n.language === 'vi') {
            const day = format(displayValue, 'd')
            const month = format(displayValue, 'M')
            const year = format(displayValue, 'yyyy')
            const time = format(displayValue, 'HH:mm:ss')
            return `${day} Tháng ${month}, ${year}, ${time}`
          }
          return format(displayValue, 'MMM d, yyyy, HH:mm:ss', { locale })
        }
      } else {
        if (i18n.language === 'vi') {
          const day = format(displayValue, 'd')
          const month = format(displayValue, 'M')
          const year = format(displayValue, 'yyyy')
          return `${day} Tháng ${month}, ${year}`
        }
        return format(displayValue, 'MMMM d, yyyy', { locale })
      }
    }, [displayValue, showTime, use12HourFormat, locale, i18n.language])

    return (
      <div ref={ref} className={className}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            {renderTrigger ? (
              renderTrigger({ value: displayValue, open, timezone, disabled, use12HourFormat })
            ) : (
              <Button
                disabled={disabled}
                variant={'outline'}
                className={cn('flex w-full justify-start px-3 font-normal', !displayValue && 'text-muted-foreground')}
              >
                <CalendarIcon className='mr-2 size-4' />
                {displayFormat}
              </Button>
            )}
          </PopoverTrigger>
          <PopoverContent className='w-auto p-3'>
            <div className='flex items-center justify-between'>
              <div className={cn('flex space-x-2', monthYearPicker ? 'hidden' : '')}>
                <Button variant='ghost' size='icon' onClick={onPrevMonth}>
                  <ChevronLeftIcon className='w-5' />
                </Button>
              </div>
              <div className='text-md flex cursor-pointer items-center pb-1 font-bold'>
                <Button
                  className='w-full p-2'
                  variant='ghost'
                  size='icon'
                  onClick={() => setMonthYearPicker(monthYearPicker === 'month' ? false : 'month')}
                >
                  <span className=''>
                    {i18n.language === 'vi' ? `Tháng ${format(month, 'MM')}` : format(month, 'MMMM', { locale })}
                  </span>
                </Button>
                <Button
                  className='w-full p-2'
                  variant='ghost'
                  size='icon'
                  onClick={() => setMonthYearPicker(monthYearPicker ? false : 'year')}
                >
                  <span className=''>{format(month, 'yyyy', { locale })}</span>
                </Button>
              </div>
              <div className={cn('flex space-x-2', monthYearPicker ? 'hidden' : '')}>
                <Button variant='ghost' size='icon' onClick={onNextMonth}>
                  <ChevronRightIcon className='w-5' />
                </Button>
              </div>
            </div>
            <div className='relative overflow-hidden'>
              <DayPicker
                mode='single'
                selected={date}
                onSelect={(d) => d && onDayChanged(d)}
                month={month}
                endMonth={endMonth}
                disabled={[max ? { after: max } : null, min ? { before: min } : null].filter(Boolean) as Matcher[]}
                onMonthChange={setMonth}
                locale={locale}
                classNames={{
                  dropdowns: 'flex w-full gap-2',
                  months: 'flex w-full h-fit',
                  month: 'flex flex-col w-full',
                  month_caption: 'hidden',
                  button_previous: 'hidden',
                  button_next: 'hidden',
                  month_grid: 'w-full border-collapse',
                  weekdays: 'flex justify-between mt-2',
                  weekday: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
                  week: 'flex w-full justify-between mt-2',
                  day: 'h-10 w-10 mx-1 text-center text-sm relative flex items-center justify-center',
                  day_button: cn(
                    buttonVariants({ variant: 'ghost' }),
                    'rounded-md font-normal transition-all hover:bg-transparent dark:text-white hover:text-primary-foreground'
                  ),
                  selected:
                    'bg-primary h-10 w-10 text-primary-foreground dark:text-white hover:bg-primary focus:bg-primary focus:text-primary-foreground rounded-md border border-primary-light shadow-md',
                  today: 'bg-accent text-accent-foreground rounded-md',
                  outside:
                    'text-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
                  disabled: 'text-muted-foreground opacity-50',
                  range_middle: 'bg-accent-light text-accent-foreground rounded-md',
                  hidden: 'invisible'
                }}
                showOutsideDays={true}
                {...props}
              />
              <div
                className={cn('absolute bottom-0 left-0 right-0 top-0', monthYearPicker ? 'bg-popover' : 'hidden')}
              ></div>
              <MonthYearPicker
                value={month}
                mode={monthYearPicker as any}
                onChange={onMonthYearChanged}
                minDate={minDate}
                maxDate={maxDate}
                locale={locale}
                className={cn('absolute bottom-0 left-0 right-0 top-0', monthYearPicker ? '' : 'hidden')}
              />
            </div>
            {showTime && (
              <TimePicker
                value={date}
                onChange={setDate}
                use12HourFormat={use12HourFormat}
                min={minDate}
                max={maxDate}
                locale={locale}
              />
            )}
            <Button className='mt-4 w-full' onClick={onSubmit}>
              {i18n.language === 'vi' ? 'Xong' : 'Done'}
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    )
  }
)

DateTimePicker.displayName = 'DateTimePicker'

function MonthYearPicker({
  value,
  minDate,
  maxDate,
  mode = 'month',
  onChange,
  locale,
  className
}: {
  value: Date
  mode: 'month' | 'year'
  minDate?: Date
  maxDate?: Date
  onChange: (value: Date, mode: 'month' | 'year') => void
  locale?: Locale
  className?: string
}) {
  const yearRef = useRef<HTMLDivElement>(null)
  const years = useMemo(() => {
    const years: TimeOption[] = []
    for (let i = 1912; i < 2100; i++) {
      let disabled = false
      const startY = startOfYear(setYear(value, i))
      const endY = endOfYear(setYear(value, i))
      if (minDate && endY < minDate) disabled = true
      if (maxDate && startY > maxDate) disabled = true
      years.push({ value: i, label: i.toString(), disabled })
    }
    return years
  }, [value, minDate, maxDate])
  const months = useMemo(() => {
    const months: TimeOption[] = []
    for (let i = 0; i < 12; i++) {
      let disabled = false
      const startM = startOfMonth(setMonthFns(value, i))
      const endM = endOfMonth(setMonthFns(value, i))
      if (minDate && endM < minDate) disabled = true
      if (maxDate && startM > maxDate) disabled = true

      if (locale === vi) {
        months.push({ value: i, label: `Tháng ${i + 1}`, disabled })
      } else {
        months.push({ value: i, label: format(new Date(0, i), 'MMM', { locale }), disabled })
      }
    }
    return months
  }, [value, minDate, maxDate, locale])

  const onYearChange = useCallback(
    (v: TimeOption) => {
      let newDate = setYear(value, v.value)
      if (minDate && newDate < minDate) {
        newDate = setMonthFns(newDate, getMonth(minDate))
      }
      if (maxDate && newDate > maxDate) {
        newDate = setMonthFns(newDate, getMonth(maxDate))
      }
      onChange(newDate, 'year')
    },
    [onChange, value, minDate, maxDate]
  )

  useEffect(() => {
    if (mode === 'year') {
      yearRef.current?.scrollIntoView({ behavior: 'auto', block: 'center' })
    }
  }, [mode, value])
  return (
    <div className={cn(className)}>
      <ScrollArea className='h-full'>
        {mode === 'year' && (
          <div className='grid grid-cols-4'>
            {years.map((year) => (
              <div key={year.value} ref={year.value === getYear(value) ? yearRef : undefined}>
                <Button
                  disabled={year.disabled}
                  variant={getYear(value) === year.value ? 'default' : 'ghost'}
                  className='rounded-full'
                  onClick={() => onYearChange(year)}
                >
                  {year.label}
                </Button>
              </div>
            ))}
          </div>
        )}
        {mode === 'month' && (
          <div className='grid grid-cols-3 gap-4'>
            {months.map((month) => (
              <Button
                key={month.value}
                size='lg'
                disabled={month.disabled}
                variant={getMonth(value) === month.value ? 'default' : 'ghost'}
                className='rounded-full'
                onClick={() => onChange(setMonthFns(value, month.value), 'month')}
              >
                {month.label}
              </Button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

interface TimeOption {
  value: number
  label: string
  disabled: boolean
}

function TimePicker({
  value,
  onChange,
  use12HourFormat,
  min,
  max,
  locale
}: {
  use12HourFormat?: boolean
  value: Date
  onChange: (date: Date) => void
  min?: Date
  max?: Date
  locale?: Locale
}) {
  const { i18n, t } = useTranslation()
  const formatStr = useMemo(
    () => (use12HourFormat ? 'yyyy-MM-dd hh:mm:ss.SSS a xxxx' : 'yyyy-MM-dd HH:mm:ss.SSS xxxx'),
    [use12HourFormat]
  )
  const [ampm, setAmPm] = useState(format(value, 'a') === 'AM' ? AM_VALUE : PM_VALUE)
  const [hour, setHour] = useState(use12HourFormat ? +format(value, 'hh') : value.getHours())
  const [minute, setMinute] = useState(value.getMinutes())
  const [second, setSecond] = useState(value.getSeconds())

  useEffect(() => {
    onChange(buildTime({ use12HourFormat, value, formatStr, hour, minute, second, ampm }))
  }, [hour, minute, second, ampm, formatStr, use12HourFormat, onChange, value])

  const _hourIn24h = useMemo(() => {
    return use12HourFormat ? (hour % 12) + ampm * 12 : hour
  }, [use12HourFormat, hour, ampm])

  const hours: TimeOption[] = useMemo(
    () =>
      Array.from({ length: use12HourFormat ? 12 : 24 }, (_, i) => {
        let disabled = false
        const hourValue = use12HourFormat ? (i === 0 ? 12 : i) : i
        const hDate = setHours(value, use12HourFormat ? i + ampm * 12 : i)
        const hStart = startOfHour(hDate)
        const hEnd = endOfHour(hDate)
        if (min && hEnd < min) disabled = true
        if (max && hStart > max) disabled = true
        return {
          value: hourValue,
          label: hourValue.toString().padStart(2, '0'),
          disabled
        }
      }),
    [value, min, max, use12HourFormat, ampm]
  )
  const minutes: TimeOption[] = useMemo(() => {
    const anchorDate = setHours(value, _hourIn24h)
    return Array.from({ length: 60 }, (_, i) => {
      let disabled = false
      const mDate = setMinutes(anchorDate, i)
      const mStart = startOfMinute(mDate)
      const mEnd = endOfMinute(mDate)
      if (min && mEnd < min) disabled = true
      if (max && mStart > max) disabled = true
      return {
        value: i,
        label: i.toString().padStart(2, '0'),
        disabled
      }
    })
  }, [value, min, max, _hourIn24h])
  const seconds: TimeOption[] = useMemo(() => {
    const anchorDate = setMilliseconds(setMinutes(setHours(value, _hourIn24h), minute), 0)
    const _min = min ? setMilliseconds(min, 0) : undefined
    const _max = max ? setMilliseconds(max, 0) : undefined
    return Array.from({ length: 60 }, (_, i) => {
      let disabled = false
      const sDate = setSeconds(anchorDate, i)
      if (_min && sDate < _min) disabled = true
      if (_max && sDate > _max) disabled = true
      return {
        value: i,
        label: i.toString().padStart(2, '0'),
        disabled
      }
    })
  }, [value, minute, min, max, _hourIn24h])
  const ampmOptions = useMemo(() => {
    const startD = startOfDay(value)
    const endD = endOfDay(value)
    return [
      { value: AM_VALUE, label: i18n.language === 'vi' ? 'SÁNG' : 'AM' },
      { value: PM_VALUE, label: i18n.language === 'vi' ? 'CHIỀU' : 'PM' }
    ].map((v) => {
      let disabled = false
      const start = addHours(startD, v.value * 12)
      const end = subHours(endD, (1 - v.value) * 12)
      if (min && end < min) disabled = true
      if (max && start > max) disabled = true
      return { ...v, disabled }
    })
  }, [value, min, max, i18n.language])

  const [open, setOpen] = useState(false)

  const hourRef = useRef<HTMLDivElement>(null)
  const minuteRef = useRef<HTMLDivElement>(null)
  const secondRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (open) {
        hourRef.current?.scrollIntoView({ behavior: 'auto' })
        minuteRef.current?.scrollIntoView({ behavior: 'auto' })
        secondRef.current?.scrollIntoView({ behavior: 'auto' })
      }
    }, 1)
    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const onHourChange = useCallback(
    (v: TimeOption) => {
      if (min) {
        let newTime = buildTime({ use12HourFormat, value, formatStr, hour: v.value, minute, second, ampm })
        if (newTime < min) {
          setMinute(min.getMinutes())
          setSecond(min.getSeconds())
        }
      }
      if (max) {
        let newTime = buildTime({ use12HourFormat, value, formatStr, hour: v.value, minute, second, ampm })
        if (newTime > max) {
          setMinute(max.getMinutes())
          setSecond(max.getSeconds())
        }
      }
      setHour(v.value)
    },
    [min, max, setHour, use12HourFormat, value, formatStr, minute, second, ampm]
  )

  const onMinuteChange = useCallback(
    (v: TimeOption) => {
      if (min) {
        let newTime = buildTime({ use12HourFormat, value, formatStr, hour, minute: v.value, second, ampm })
        if (newTime < min) {
          setSecond(min.getSeconds())
        }
      }
      if (max) {
        let newTime = buildTime({ use12HourFormat, value, formatStr, hour, minute: v.value, second, ampm })
        if (newTime > max) {
          setSecond(newTime.getSeconds())
        }
      }
      setMinute(v.value)
    },
    [min, max, setMinute, use12HourFormat, value, formatStr, hour, second, ampm]
  )

  const onAmpmChange = useCallback(
    (v: TimeOption) => {
      if (min) {
        let newTime = buildTime({ use12HourFormat, value, formatStr, hour, minute, second, ampm: v.value })
        if (newTime < min) {
          const minH = min.getHours() % 12
          setHour(minH === 0 ? 12 : minH)
          setMinute(min.getMinutes())
          setSecond(min.getSeconds())
        }
      }
      if (max) {
        let newTime = buildTime({ use12HourFormat, value, formatStr, hour, minute, second, ampm: v.value })
        if (newTime > max) {
          const maxH = max.getHours() % 12
          setHour(maxH === 0 ? 12 : maxH)
          setMinute(max.getMinutes())
          setSecond(max.getSeconds())
        }
      }
      setAmPm(v.value)
    },
    [min, max, setAmPm, use12HourFormat, value, formatStr, hour, minute, second]
  )

  const display = useMemo(() => {
    return format(value, use12HourFormat ? `hh:mm:ss a` : `HH:mm:ss`, { locale })
  }, [value, use12HourFormat, locale])

  return (
    <div className='w-full'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className='w-full'>
          <Button variant='outline' role='combobox' aria-expanded={open} className='justify-between'>
            <Clock className='mr-2 size-4' />
            {display}
            <ChevronDownIcon className='ml-2 size-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='p-0' side='top'>
          <div className='flex-col gap-2 p-2'>
            <div className='flex h-56 grow'>
              <ScrollArea className='h-full flex-grow'>
                <div className='flex grow flex-col items-stretch overflow-y-auto pb-48 pe-2'>
                  {hours.map((v) => (
                    <div key={v.value} ref={v.value === hour ? hourRef : undefined}>
                      <TimeItem
                        option={v}
                        selected={v.value === hour}
                        onSelect={onHourChange}
                        className='h-8'
                        disabled={v.disabled}
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <ScrollArea className='h-full flex-grow'>
                <div className='flex grow flex-col items-stretch overflow-y-auto pb-48 pe-2'>
                  {minutes.map((v) => (
                    <div key={v.value} ref={v.value === minute ? minuteRef : undefined}>
                      <TimeItem
                        option={v}
                        selected={v.value === minute}
                        onSelect={onMinuteChange}
                        className='h-8'
                        disabled={v.disabled}
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <ScrollArea className='h-full flex-grow'>
                <div className='flex grow flex-col items-stretch overflow-y-auto pb-48 pe-2'>
                  {seconds.map((v) => (
                    <div key={v.value} ref={v.value === second ? secondRef : undefined}>
                      <TimeItem
                        option={v}
                        selected={v.value === second}
                        onSelect={(v) => setSecond(v.value)}
                        className='h-8'
                        disabled={v.disabled}
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
              {use12HourFormat && (
                <ScrollArea className='h-full flex-grow'>
                  <div className='flex grow flex-col items-stretch overflow-y-auto pe-2'>
                    {ampmOptions.map((v) => (
                      <TimeItem
                        key={v.value}
                        option={v}
                        selected={v.value === ampm}
                        onSelect={onAmpmChange}
                        className='h-8'
                        disabled={v.disabled}
                      />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

const TimeItem = ({
  option,
  selected,
  onSelect,
  className,
  disabled
}: {
  option: TimeOption
  selected: boolean
  onSelect: (option: TimeOption) => void
  className?: string
  disabled?: boolean
}) => {
  return (
    <Button
      variant='ghost'
      className={cn('flex justify-center px-1 pe-2 ps-1', className)}
      onClick={() => onSelect(option)}
      disabled={disabled}
    >
      <div className='w-4'>{selected && <CheckIcon className='my-auto size-4' />}</div>
      <span className='ms-2'>{option.label}</span>
    </Button>
  )
}

interface BuildTimeOptions {
  use12HourFormat?: boolean
  value: Date
  formatStr: string
  hour: number
  minute: number
  second: number
  ampm: number
}

function buildTime(options: BuildTimeOptions) {
  const { use12HourFormat, value, formatStr, hour, minute, second, ampm } = options
  let date: Date
  if (use12HourFormat) {
    const dateStrRaw = format(value, formatStr)
    let dateStr = dateStrRaw.slice(0, 11) + hour.toString().padStart(2, '0') + dateStrRaw.slice(13)
    dateStr = dateStr.slice(0, 14) + minute.toString().padStart(2, '0') + dateStr.slice(16)
    dateStr = dateStr.slice(0, 17) + second.toString().padStart(2, '0') + dateStr.slice(19)
    dateStr = dateStr.slice(0, 24) + (ampm == AM_VALUE ? 'AM' : 'PM') + dateStr.slice(26)
    date = parse(dateStr, formatStr, value)
  } else {
    date = setHours(setMinutes(setSeconds(value, second), minute), hour)
  }
  return date
}
