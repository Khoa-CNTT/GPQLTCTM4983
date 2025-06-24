import type { Metadata } from 'next'
import { Inter as FontSans, Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/libraries/utils'
import configProject from '../config/configService'
import QueryProvider from '@/libraries/query-provider'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/libraries/theme-provider'
import { ReactNode } from 'react'
import 'nprogress/nprogress.css'
import dynamic from 'next/dynamic'
import { SocketProvider } from '../libraries/useSocketIo'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Script from 'next/script'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'UNIKO - Quản Lý Tài Chính Thông Minh | Lê Minh Tuấn',
  description: 'UNIKO - Ứng dụng quản lý tài chính thông minh với AI giúp theo dõi chi tiêu, ghi chép tự động và phân tích dữ liệu tài chính cá nhân. Phát triển bởi Lê Minh Tuấn (auroraphtgrp).',
  keywords: 'UNIKO, Lê Minh Tuấn, auroraphtgrp, quản lý tài chính, quản lý tài chính thông minh, ứng dụng quản lý tài chính, theo dõi chi tiêu, ghi chép chi tiêu tự động, AI, trợ lý thông minh, phân tích tài chính',
  icons: 'favicon.ico',
  openGraph: {
    title: 'UNIKO - Quản Lý Tài Chính Thông Minh | Lê Minh Tuấn',
    description: 'Ứng dụng quản lý tài chính thông minh với AI giúp theo dõi chi tiêu, ghi chép tự động và phân tích dữ liệu tài chính cá nhân.',
    url: 'https://uniko.vn',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UNIKO - Quản Lý Tài Chính Thông Minh 1',
    description: 'Ứng dụng quản lý tài chính thông minh với AI giúp theo dõi chi tiêu và phân tích dữ liệu tài chính cá nhân.'
  }
}

const TopProgressBar = dynamic(
  () => {
    return import('@/components/core/top-progress-bar')
  },
  { ssr: false }
)

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'UNIKO',
    applicationCategory: 'FinanceApplication',
    description:
      'Phần mềm quản lý tài chính thông minh UNIKO giúp tối ưu hóa việc theo dõi và quản lý tài chính cá nhân với AI',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'VND'
    },
    author: {
      '@type': 'Person',
      name: 'Lê Minh Tuấn',
      alternateName: 'auroraphtgrp',
      url: 'https://github.com/auroraphtgrp01'
    },
    keywords: 'UNIKO, quản lý tài chính, theo dõi chi tiêu, AI, trợ lý thông minh'
  }

  return (
    <html lang='en' suppressHydrationWarning className={inter.className}>
      <head>
        <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
        <Script
          strategy='afterInteractive'
          src={`https://www.googletagmanager.com/gtag/js?id=${configProject.NEXT_PUBLIC_GA_ID}`}
        />
        <Script
          id='google-analytics'
          strategy='afterInteractive'
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${configProject.NEXT_PUBLIC_GA_ID}');
            `
          }}
        />
      </head>
      <body className={cn('min-h-screen font-sans antialiased')}>
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
        <SocketProvider>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
            <GoogleOAuthProvider clientId={configProject.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
              <QueryProvider>{children}</QueryProvider>
            </GoogleOAuthProvider>
          </ThemeProvider>
        </SocketProvider>
      </body>
    </html>
  )
}
