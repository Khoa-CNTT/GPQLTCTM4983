'use client'

import { ThemeProvider } from '@/libraries/theme-provider'
import { ReactNode, useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import QueryProvider from '@/libraries/query-provider'
import 'nprogress/nprogress.css'
import dynamic from 'next/dynamic'
import { Inter } from 'next/font/google'
import { usePathname } from 'next/navigation'
import I18nProvider from '@/libraries/i18n-provider'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap'
})

// Dynamic imports để lazy load các components
const TopProgressBar = dynamic(
  () => import('@/components/core/top-progress-bar'),
  { ssr: false }
)

const AdminHeader = dynamic(
  () => import('./dashboard/components/header'),
  { ssr: false }
)

const AdminSidebar = dynamic(
  () => import('./dashboard/components/sidebar'),
  { ssr: false }
)

export default function AdminLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [languageKey, setLanguageKey] = useState(0)

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    setMounted(true)
    
    const handleLanguageChange = () => {
      setLanguageKey(prev => prev + 1)
    }
    
    window.addEventListener('languageChanged', handleLanguageChange)
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange)
    }
  }, [])

  const renderContent = () => {
    if (isLoginPage) {
      return children
    }

    return (
      <div className="flex min-h-screen flex-col bg-background">
        <div className="sticky top-0 z-30 h-[3.2rem] border-b-[1px] bg-background_nav">
          <AdminHeader />
        </div>

        <div className="flex flex-1 overflow-hidden">
          <AdminSidebar />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className={inter.className} key={languageKey}>
      <Toaster
        toastOptions={{
          duration: 5000,
          style: {
            border: '1px solid #fff',
            padding: '16px',
            fontSize: '14px'
          },
          success: {},
          error: {}
        }}
        position='top-center'
        reverseOrder={false}
        gutter={8}
        containerClassName=''
        containerStyle={{}}
      />
      <TopProgressBar />
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
        <QueryProvider>
          <I18nProvider>
            {mounted ? renderContent() : null}
          </I18nProvider>
        </QueryProvider>
      </ThemeProvider>
    </div>
  )
} 