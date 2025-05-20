'use client'

import React, { ReactNode, useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n, { initI18n } from './i18n'

interface I18nProviderProps {
  children: ReactNode
}

export default function I18nProvider({ children }: I18nProviderProps) {
  const [isI18nInitialized, setIsI18nInitialized] = useState(false)

  useEffect(() => {
    const i18nInstance = initI18n()
    setIsI18nInitialized(true)
    
    const originalChangeLanguage = i18nInstance.changeLanguage.bind(i18nInstance)
    i18nInstance.changeLanguage = async (lng?: string, callback?: any) => {
      const result = await originalChangeLanguage(lng, callback)
      window.dispatchEvent(new Event('languageChanged'))
      return result
    }
    
    return () => {
      i18nInstance.changeLanguage = originalChangeLanguage
    }
  }, [])

  if (!isI18nInitialized) {
    return null
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
} 