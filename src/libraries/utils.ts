import { IDateRange } from '@/core/tracker-transaction/models/tracker-transaction.interface'
import { IDynamicType } from '@/types/common.i'
import { IBodyFormField } from '@/types/formZod.interface'
import { KNamespace, KPrefix } from '@/types/i18n'
import { type ClassValue, clsx } from 'clsx'
import i18next, { Namespace, TFunction, TOptions } from 'i18next'
import { twMerge } from 'tailwind-merge'
import { addDays } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}
export const convertToCamelCase = (str: string) => {
  const words = str.toLowerCase().split(' ')
  for (let i = 1; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1)
  }
  return words.join('')
}

export const formatCurrency = (amount: number, currency = 'USD', locale = 'en-US') => {
  const formattedAmount = new Intl.NumberFormat(locale).format(amount)
  return `${formattedAmount} ${currency}`
}

export const formatDateTimeVN = (date: string, hasTime: boolean) => {
  if (isNaN(new Date(date).getTime())) {
    return date
  }

  const formattedDate = new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date))

  if (hasTime) {
    const formattedTime = new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
    return `${formattedTime} - ${formattedDate}`
  }

  return formattedDate
}
const getPropertyByPath = (data: any, propertyPath: string): any => {
  const properties = propertyPath.split('.')
  return properties.reduce((prev, curr) => prev && prev[curr], data)
}

export const getTypes = (data: any, propertyName: string): string[] => {
  const types: string[] = data.map((item: any) => getPropertyByPath(item, propertyName))
  return Array.from(new Set(types))
}

const camelCaseToTitleCase = (input: string): string => {
  const result = input.replace(/([A-Z])/g, ' $1').trim()
  return result
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const getConvertedKeysToTitleCase = (obj: Record<string, any> = {}): string[] =>
  Object.keys(obj).map(camelCaseToTitleCase)

export const formatArrayData = <T, R>(data: T[], formatFunc: (item: T) => R): R[] => {
  return data.map((item: T) => {
    return formatFunc(item)
  })
}

export function replaceParams(pathUrl: string, params: IDynamicType) {
  return pathUrl.replace(/:(\w+)/g, (_, key) => {
    return params[key] ? params[key] : `:${key}`
  })
}

export function mergeQueryParams(query: IDynamicType): string {
  return Object.keys(query)
    .map((key) => `${key}=${encodeURIComponent(query ? query[key] : '')}`)
    .join('&')
}

export function formatDateToInput(dateString: string | undefined) {
  if (!dateString) return undefined
  const date = new Date(dateString)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const getCurrentMonthDateRange = (): IDateRange => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const startDay = new Date(year, month, 1)
  const endDay = new Date(year, month + 1, 0)
  return {
    startDay,
    endDay
  }
}

export const getCurrentWeekRange = () => {
  const today = new Date()
  const startDay = new Date(today)
  startDay.setDate(today.getDate() - today.getDay() + 1)
  startDay.setHours(0, 0, 0, 0)

  const endDay = new Date(today)
  endDay.setDate(today.getDate() - today.getDay() + 7)
  endDay.setHours(23, 59, 59, 999)

  return {
    startDay,
    endDay
  }
}

export function translate(Ns: Namespace): TFunction<Namespace, KPrefix>
export function translate(Ns: Namespace, options?: TOptions<any>): string
export function translate(Ns: KNamespace, options?: TOptions<any>): string | TFunction<Namespace, KPrefix> {
  if (typeof Ns === 'string' || Array.isArray(Ns)) {
    return ((key: typeof Ns, options?: TOptions<any>) => i18next.t(key, { ns: Ns, ...options })) as TFunction<
      Namespace,
      KPrefix
    >
  }
  return i18next.t(Ns, options)
}

export function getTranslatedFormBody(formBody: IBodyFormField[], t: Function): IBodyFormField[] {
  return formBody.map((field) => ({
    ...field,
    label: typeof field.label === 'string' ? t(field.label) : field.label,
    placeHolder: typeof field.placeHolder === 'string' ? t(field.placeHolder) : field.placeHolder,
    dataSelector: field.dataSelector?.map((option) => ({
      ...option,
      label: typeof option.label === 'string' ? t(option.label) : option.label
    }))
  }))
}

export const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate()
}
export const getDaysForMonth = (month: number, year: number) => {
  const numberOfDays = getDaysInMonth(month, year)
  return Array.from({ length: numberOfDays }, (_, i) => i + 1)
}

export const getNextDayOfWeek = (dayOfWeek: number): Date => {
  const today = new Date()
  const todayDayOfWeek = today.getDay()

  let daysToAdd = dayOfWeek - todayDayOfWeek

  if (daysToAdd <= 0) {
    daysToAdd += 7
  }

  return addDays(today, daysToAdd)
}

export const getNextDayOfMonth = (day: number): Date => {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  const targetDate = new Date(currentYear, currentMonth, day)

  if (targetDate < today) {
    return new Date(currentYear, currentMonth + 1, day)
  }

  return targetDate
}
