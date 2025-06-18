import MainSection from '@/components/homepage/MainSection'
import { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'UNIKO - Quản Lý Tài Chính Thông Minh',
  description: 'UNIKO - Ứng dụng quản lý tài chính thông minh với AI giúp theo dõi chi tiêu, ghi chép tự động và phân tích dữ liệu tài chính cá nhân. Phát triển bởi Lê Minh Tuấn (auroraphtgrp).',
  keywords: 'UNIKO, Lê Minh Tuấn, auroraphtgrp, quản lý tài chính, quản lý tài chính thông minh, ứng dụng quản lý tài chính, theo dõi chi tiêu, ghi chép chi tiêu tự động, AI, trợ lý thông minh, phân tích tài chính',
  openGraph: {
    title: 'UNIKO - Quản Lý Tài Chính Thông Minh',
    description: 'Ứng dụng quản lý tài chính thông minh với AI giúp theo dõi chi tiêu, ghi chép tự động và phân tích dữ liệu tài chính cá nhân.',
    url: 'https://uniko.vn',
    type: 'website',
    images: [
      {
        url: 'https://uniko.vn/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'UNIKO - Quản lý tài chính thông minh'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UNIKO - Quản Lý Tài Chính Thông Minh',
    description: 'Ứng dụng quản lý tài chính thông minh với AI giúp theo dõi chi tiêu và phân tích dữ liệu tài chính cá nhân.'
  }
}

export default function Home() {
  return (
    <>
      <Script id="structured-data" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "UNIKO",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web, iOS, Android",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "VND"
            },

            "description": "Phần mềm quản lý tài chính thông minh UNIKO giúp tối ưu hóa việc theo dõi và quản lý tài chính cá nhân với AI",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "235",
              "bestRating": "5",
              "worstRating": "1"
            },
            "featureList": "Theo dõi chi tiêu, Phân tích tài chính, Trợ lý AI thông minh, Bảo mật dữ liệu, Đồng bộ đa thiết bị",
            "keywords": "quản lý tài chính, theo dõi chi tiêu, ghi chép chi tiêu tự động, AI tài chính, ứng dụng quản lý chi tiêu"
          }
        `}
      </Script>
      <MainSection />
    </>
  )
}
