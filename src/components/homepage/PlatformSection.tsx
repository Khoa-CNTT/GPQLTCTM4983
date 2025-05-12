'use client'

import { motion } from 'framer-motion'
import { Laptop, Smartphone, TabletSmartphone, Check } from 'lucide-react'
import Image from 'next/image'

export const PlatformSection = () => {
  const platforms = [
    {
      name: 'Web App',
      icon: <Laptop className='h-8 w-8 text-indigo-500' />,
      description: 'Trải nghiệm mượt mà trên mọi trình duyệt với giao diện đáp ứng hoàn hảo',
      features: [
        'Đồng bộ hóa dữ liệu thời gian thực',
        'Thống kê chi tiết và trực quan',
        'Truy cập từ mọi thiết bị có trình duyệt'
      ],
      color: 'from-indigo-400 to-indigo-500',
      darkColor: 'from-indigo-500/80 to-indigo-700/80',
      accentColor: 'indigo'
    },
    {
      name: 'Android',
      icon: <Smartphone className='h-8 w-8 text-teal-500' />,
      description: 'Ứng dụng Android tối ưu với hiệu suất cao và trải nghiệm người dùng tuyệt vời',
      features: ['Thông báo thông minh', 'Theo dõi chi tiêu nhanh chóng', 'Chụp hóa đơn tự động phân loại'],
      color: 'from-teal-400 to-teal-500',
      darkColor: 'from-teal-500/80 to-teal-700/80',
      accentColor: 'teal'
    },
    {
      name: 'iOS',
      icon: <TabletSmartphone className='h-8 w-8 text-fuchsia-500' />,
      description: 'Thiết kế tinh tế và mượt mà trên các thiết bị iOS',
      features: ['Face ID / Touch ID để bảo mật', 'Widget quản lý tài chính', 'Tích hợp với Apple Health và Wallet'],
      color: 'from-fuchsia-400 to-fuchsia-500',
      darkColor: 'from-fuchsia-500/80 to-fuchsia-700/80',
      accentColor: 'fuchsia'
    }
  ]

  // Function to get the appropriate CSS class based on the color
  const getBgClass = (color: string, isDark: boolean) => {
    if (color === 'indigo') return isDark ? 'bg-indigo-900/30' : 'bg-indigo-100'
    if (color === 'teal') return isDark ? 'bg-teal-900/30' : 'bg-teal-100'
    if (color === 'fuchsia') return isDark ? 'bg-fuchsia-900/30' : 'bg-fuchsia-100'
    return isDark ? 'bg-gray-800' : 'bg-gray-100'
  }

  const getTextClass = (color: string, isDark: boolean) => {
    if (color === 'indigo') return isDark ? 'text-indigo-400' : 'text-indigo-500'
    if (color === 'teal') return isDark ? 'text-teal-400' : 'text-teal-500'
    if (color === 'fuchsia') return isDark ? 'text-fuchsia-400' : 'text-fuchsia-500'
    return isDark ? 'text-gray-300' : 'text-gray-600'
  }

  return (
    <section className='relative overflow-hidden py-16 sm:py-20'>
      {/* Background Elements - Updated */}
      <div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent pointer-events-none'></div>

      <div className='container relative z-10 mx-auto px-4'>
        {/* Section Header */}
        <div className='mx-auto mb-12 max-w-2xl text-center sm:mb-16'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='inline-block'
          >
            <span className='mb-3 inline-block rounded-full bg-indigo-50/80 px-3.5 py-1 text-xs font-medium tracking-wide text-indigo-500 dark:bg-indigo-950/30 dark:text-indigo-300'>
              Sẵn sàng trên mọi thiết bị
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className='mb-3 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text text-xl font-bold text-transparent md:text-2xl lg:text-3xl'
          >
            Đa Nền Tảng
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='text-xs text-gray-500 dark:text-gray-400 sm:text-sm'
          >
            Trải nghiệm liền mạch trên mọi thiết bị với giải pháp quản lý tài chính hiện đại của chúng tôi
          </motion.p>
        </div>

        {/* Cards Section */}
        <div className='grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-8'>
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className='relative flex h-full flex-col overflow-hidden rounded-xl shadow-sm transition-all duration-300 hover:shadow-md dark:shadow-gray-900/10'
            >
              {/* Card Header with Gradient */}
              <div
                className={`relative flex h-24 items-center bg-gradient-to-r p-4 ${platform.color} dark:${platform.darkColor}`}
              >
                <div className='absolute inset-0 opacity-10'>
                  <svg className='h-full w-full' viewBox='0 0 100 100' preserveAspectRatio='none'>
                    <defs>
                      <pattern id={`grid-${index}`} width='10' height='10' patternUnits='userSpaceOnUse'>
                        <path d='M 10 0 L 0 0 0 10' fill='none' stroke='white' strokeWidth='0.4' strokeOpacity='0.2' />
                      </pattern>
                    </defs>
                    <rect width='100' height='100' fill={`url(#grid-${index})`} />
                  </svg>
                </div>

                <div className='relative flex items-center gap-3'>
                  <div className='rounded-lg bg-white/90 p-2 shadow-sm backdrop-blur-sm'>{platform.icon}</div>
                  <h3 className='text-lg font-semibold text-white'>{platform.name}</h3>
                </div>
              </div>

              {/* Card Content */}
              <div className='relative flex-grow space-y-3.5 bg-white p-5 dark:bg-gray-800/90'>
                <p className='text-xs leading-relaxed text-gray-500 dark:text-gray-400 sm:text-sm'>
                  {platform.description}
                </p>

                <div className='space-y-2 pt-2'>
                  <h4 className='mb-2 text-sm font-medium text-gray-600 dark:text-gray-300'>Tính năng nổi bật:</h4>
                  {platform.features.map((feature, i) => (
                    <div key={i} className='flex items-center gap-2'>
                      <div
                        className={`flex h-4 w-4 items-center justify-center rounded-full ${getBgClass(platform.accentColor, false)} dark:${getBgClass(platform.accentColor, true)}`}
                      >
                        <Check
                          size={10}
                          className={`${getTextClass(platform.accentColor, false)} dark:${getTextClass(platform.accentColor, true)}`}
                        />
                      </div>
                      <span className='text-xs text-gray-500 dark:text-gray-400'>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Decorative element */}
                <div className='pointer-events-none absolute bottom-3 right-3 opacity-20'>
                  <div
                    className={`h-8 w-8 rounded-full bg-gradient-to-r ${platform.color} dark:${platform.darkColor}`}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
