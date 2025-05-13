'use client'

import { useState, useMemo, memo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Database, Shield, Zap, Smartphone, LayoutGrid, Activity } from 'lucide-react'
import OptimizedImage from './OptimizedImage'
import Image from 'next/image'

interface FeatureTabProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  'aria-controls'?: string;
}

// Optimized tab component with memo to prevent unnecessary re-renders
const FeatureTab = memo(({ icon, label, isActive, onClick, ...props }: FeatureTabProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-selected={isActive}
    {...props}
    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
      isActive
        ? 'bg-gradient-to-r from-indigo-50 to-indigo-100/50 text-indigo-600 dark:from-indigo-950/50 dark:to-indigo-900/30 dark:text-indigo-400'
        : 'text-slate-600 hover:bg-gray-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
    }`}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </button>
))

FeatureTab.displayName = 'FeatureTab'

// Define platform features with SEO-relevant content
export const PlatformSection = memo(() => {
  const [activeTab, setActiveTab] = useState(0)

  // Memoize tab data to prevent re-creation on render
  const tabs = useMemo(() => [
    {
      id: 'tracking',
      label: 'Theo dõi chi tiêu',
      icon: <Activity className="h-4 w-4 text-indigo-500" />,
      image: '/platform/tracking.webp',
      altText: 'UNIKO - Ứng dụng theo dõi chi tiêu thông minh với AI',
      title: 'Theo dõi chi tiêu thông minh',
      description:
        'UNIKO giúp bạn ghi chép chi tiêu tự động, phân loại giao dịch bằng AI và tạo báo cáo chi tiết. Dễ dàng theo dõi và quản lý mọi khoản chi tiêu hàng ngày với giao diện trực quan, thân thiện.'
    },
    {
      id: 'ai-assistant',
      label: 'Trợ lý thông minh',
      icon: <Sparkles className="h-4 w-4 text-violet-500" />,
      image: '/platform/ai-assistant.webp',
      altText: 'Trợ lý AI thông minh giúp quản lý tài chính hiệu quả',
      title: 'Trợ lý AI thông minh',
      description:
        'AI phân tích chi tiêu, dự báo xu hướng và đưa ra lời khuyên tài chính cá nhân hóa. Tìm hiểu cách tối ưu ngân sách và đạt mục tiêu tài chính với trợ lý AI của chúng tôi do Lê Minh Tuấn phát triển.'
    },
    {
      id: 'insights',
      label: 'Phân tích chuyên sâu',
      icon: <Database className="h-4 w-4 text-rose-500" />,
      image: '/platform/insights.webp',
      altText: 'Phân tích tài chính chuyên sâu với báo cáo trực quan',
      title: 'Phân tích tài chính chuyên sâu',
      description:
        'Báo cáo trực quan về chi tiêu, thu nhập, tiết kiệm và đầu tư. UNIKO cung cấp cái nhìn toàn diện về tình hình tài chính và giúp bạn đưa ra quyết định sáng suốt.'
    },
    {
      id: 'mobile',
      label: 'Đa nền tảng',
      icon: <Smartphone className="h-4 w-4 text-emerald-500" />,
      image: '/platform/mobile.webp',
      altText: 'UNIKO hoạt động trên nhiều nền tảng - Web, di động và máy tính',
      title: 'Truy cập đa nền tảng',
      description:
        'Sử dụng UNIKO trên mọi thiết bị - máy tính, điện thoại, tablet với đồng bộ hóa dữ liệu theo thời gian thực. Quản lý tài chính mọi lúc, mọi nơi.'
    },
    {
      id: 'security',
      label: 'Bảo mật',
      icon: <Shield className="h-4 w-4 text-amber-500" />,
      image: '/platform/security.webp',
      altText: 'Bảo mật dữ liệu tài chính tối đa với mã hóa đa lớp',
      title: 'Bảo mật tối đa',
      description:
        'Dữ liệu tài chính của bạn được bảo vệ với mã hóa đa lớp, xác thực hai yếu tố và các tiêu chuẩn bảo mật hàng đầu. Chúng tôi coi trọng việc bảo vệ thông tin tài chính cá nhân của bạn.'
    }
  ], [])

  return (
    <section className="relative" aria-labelledby="platform-section-title">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-3 inline-block rounded-full bg-indigo-50/80 px-3.5 py-1 text-xs font-medium tracking-wide text-indigo-500 dark:bg-indigo-950/30 dark:text-indigo-300"
          >
            Nền tảng quản lý tài chính thông minh
          </motion.span>
          <motion.h2
            id="platform-section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-3 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text text-xl font-bold text-transparent md:text-2xl lg:text-3xl"
          >
            Tất cả trong một nền tảng quản lý
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            UNIKO cung cấp đầy đủ công cụ và tính năng giúp bạn quản lý tài chính cá nhân hiệu quả
          </motion.p>
        </div>

        {/* Feature tabs - optimized with reduced motion and better accessibility */}
        <div className="mt-12 rounded-xl border border-gray-100 bg-white p-1 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {/* Tab navigation */}
          <div className="mb-4 flex flex-wrap gap-2 p-2" role="tablist" aria-label="Tính năng quản lý tài chính UNIKO">
            {tabs.map((tab, index) => (
              <FeatureTab
                key={tab.id}
                icon={tab.icon}
                label={tab.label}
                isActive={activeTab === index}
                onClick={() => setActiveTab(index)}
                aria-controls={`tabpanel-${tab.id}`}
              />
            ))}
          </div>

          {/* Tab content with reduced animations for better performance */}
          <div className="px-6 pb-6">
            {tabs.map((tab, index) => (
              <div
                key={tab.id}
                id={`tabpanel-${tab.id}`}
                role="tabpanel"
                aria-labelledby={`tab-${tab.id}`}
                hidden={activeTab !== index}
                className={`${activeTab === index ? 'block' : 'hidden'}`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4 }}
                  className="grid gap-8 md:grid-cols-2"
                >
                  {/* Feature description */}
                  <div className="flex flex-col justify-center">
                    <h3 className="mb-3 text-lg font-bold text-gray-800 dark:text-white sm:text-xl">
                      {tab.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {tab.description}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {[
                        'Giao diện trực quan dễ sử dụng',
                        'Cá nhân hóa theo nhu cầu của bạn',
                        'Cập nhật liên tục với tính năng mới'
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                            <Zap className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Feature image with optimized loading */}
                  <div className="overflow-hidden rounded-lg border border-gray-100 bg-gray-50 shadow-sm dark:border-gray-800 dark:bg-gray-800">
                    <div className="relative aspect-video w-full">
                      <OptimizedImage
                        src={tab.image}
                        alt={tab.altText}
                        width={600}
                        height={338}
                        fill={true}
                        quality={85}
                        sizes="(max-width: 768px) 100vw, 600px"
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
})

PlatformSection.displayName = 'PlatformSection'
