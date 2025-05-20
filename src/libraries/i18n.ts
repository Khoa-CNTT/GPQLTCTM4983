import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import EN from '../locales/en'
import VI from '../locales/vi'

export const locales = {
  en: 'en',
  vi: 'vi'
} as const

export const resources = {
  en: EN,
  vi: VI
}

export const defaultNS = 'overview'

let isInitialized = false

export const initI18n = () => {
  if (isInitialized) return i18next

  i18next.use(initReactI18next).init({
    lng: 'en',
    resources,
    fallbackLng: 'en',
    defaultNS,
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false // Tắt suspense để tránh lỗi khi sử dụng useTranslation
    }
  })

  isInitialized = true
  return i18next
}

const i18n = initI18n()

export default i18n
