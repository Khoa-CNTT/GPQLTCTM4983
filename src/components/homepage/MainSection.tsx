'use client'

import { useRef, useEffect, memo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import dynamic from 'next/dynamic'
import { initPerformanceOptimizations } from '@/libraries/performance-optimization'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

// Import static assets
import AvatarTuan from '@/images/contributors/Tuan.jpg'
import AvatarKhanh from '@/images/contributors/Khanh.jpg'
import AvatarHuy from '@/images/contributors/Huy.jpg'
import AvatarThanh from '@/images/contributors/Thanh.jpg'
import AvatarTrong from '@/images/contributors/Trong.jpg'

// Dynamically import heavyweight components
const HeroSection = dynamic(() => import('@/components/homepage/HeroSection'), {
  ssr: true,
  loading: () => (
    <div className="min-h-[600px] animate-pulse bg-gradient-to-b from-slate-100 to-white dark:from-slate-900 dark:to-slate-800"></div>
  )
})

const ContributorsSection = dynamic(() => import('@/components/homepage/ContributorsSection'), {
  ssr: true
})

const Navbar = dynamic(() => import('@/components/homepage/Navbar'), {
  ssr: true
})

const BentoGridThird = dynamic(() => import('@/components/homepage/Grid').then(mod => mod.BentoGridThird), {
  ssr: true
})

const MarqueeReview = dynamic(() => import('@/components/homepage/Marquee').then(mod => mod.MarqueeReview), {
  ssr: true
})

const PlatformSection = dynamic(() => import('@/components/homepage/PlatformSection').then(mod => mod.PlatformSection), {
  ssr: true
})

const IPhoneDemo = dynamic(() => import('./IPhoneDemo').then(mod => mod.IPhoneDemo), {
  ssr: false // Heavy component, load it after initial render
})

// Define contributor data to prevent re-creation on render
const contributors = [
  {
    name: 'Le Minh Tuan',
    role: 'Founder & Leader Developer',
    image: AvatarTuan,
    srcGit: 'https://github.com/auroraphtgrp01',
    priority: true
  },
  {
    name: 'Tran Nguyen Duy Khanh',
    role: 'Fullstack Developer',
    image: AvatarKhanh,
    srcGit: 'https://github.com/AugustusDngQt'
  },
  {
    name: 'Ho Thi Thanh Thanh',
    role: 'Frontend Developer',
    image: AvatarThanh,
    srcGit: 'https://github.com/ThanhkThanh'
  },
  {
    name: 'Doan Vo Van Trong',
    role: 'Frontend Developer',
    image: AvatarTrong,
    srcGit: 'https://github.com/vantrong2405'
  },
  {
    name: 'Nguyen Quang Huy',
    role: 'Frontend Developer',
    image: AvatarHuy,
    srcGit: 'https://github.com/kwanghy2303'
  }
]

const MainSection = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50])

  // Initialize performance optimizations when component mounts
  useEffect(() => {
    initPerformanceOptimizations()
  }, [])

  return (
    <div className='relative min-h-screen w-full bg-gradient-to-b from-rose-50/20 via-white to-gray-50/70 dark:from-gray-950 dark:via-gray-900 dark:to-black'>
      {/* Background Effects - Refined & Subtle */}
      <div className='fixed inset-0 z-0 bg-grid-white/[0.02] dark:bg-grid-white/[0.01]'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.03),transparent_50%)]' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.03),transparent_50%)]' />
      </div>

      {/* Animated Particles - Reduced number for better performance */}
      <motion.div className='fixed inset-0 z-0 overflow-hidden' style={{ opacity }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className='absolute h-1 w-1 rounded-full bg-gradient-to-b from-violet-300 to-violet-300 opacity-40 backdrop-blur-sm'
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              scale: [0, 1, 0],
              opacity: [0, Math.random() * 0.3 + 0.1, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}
      </motion.div>

      {/* Main Content */}
      <div className='relative z-10'>
        <Navbar />

        {/* Hero Section with Scroll Animation */}
        <motion.div className='relative' id="home">
          <HeroSection />
        </motion.div>

        {/* Content Sections with Optimized Rendering */}
        <div className='mx-auto max-w-7xl space-y-28 px-4 py-16 sm:px-6 lg:px-8'>
          {/* Feature Overview Section */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='relative'
          >
            <div className='absolute -mt-32 opacity-0' id='overview'></div>
            <div className='mb-12 text-center'>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className='mb-3 inline-block rounded-full bg-indigo-50/80 px-3.5 py-1 text-xs font-medium tracking-wide text-indigo-500 dark:bg-indigo-950/30 dark:text-indigo-300'
              >
                Tính năng quản lý tài chính nổi bật
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className='mb-3 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text text-xl font-bold text-transparent md:text-2xl lg:text-3xl'
              >
                Kiểm soát tài chính của bạn
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className='mx-auto max-w-2xl text-xs text-gray-500 dark:text-gray-400 sm:text-sm'
              >
                Khám phá các tính năng mạnh mẽ giúp bạn quản lý tài chính một cách thông minh và hiệu quả
              </motion.p>
            </div>

            <BentoGridThird />
          </motion.section>

          {/* Platform Section */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            id='platform'
            className='relative pt-8'
          >
            <PlatformSection />
          </motion.section>

          {/* App Demo Section - Lazy loaded for performance */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            id='demo'
            className='relative scroll-m-20 py-12'
          >
            <IPhoneDemo />
          </motion.section>

          {/* User Reviews */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='relative py-14'
          >
            <div className='relative z-10 mb-10 text-center'>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className='mb-3 inline-block rounded-full bg-amber-50/80 px-3.5 py-1 text-xs font-medium tracking-wide text-amber-600 dark:bg-amber-950/30 dark:text-amber-300'
              >
                Khách hàng nói gì về UNIKO
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className='mb-3 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-xl font-bold text-transparent md:text-2xl lg:text-3xl'
              >
                Đánh giá từ người dùng UNIKO
              </motion.h2>
            </div>
            <div className='relative z-10'>
              <MarqueeReview />
            </div>
          </motion.section>

          {/* Contributors Section */}
          <motion.section
            id='contributors'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='relative'
          >
            <ContributorsSection contributors={contributors} />
          </motion.section>
        </div>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className='relative overflow-hidden py-16'
        >
          <div className='relative z-10 mx-auto max-w-3xl px-4 text-center'>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className='mb-4 bg-gradient-to-r from-fuchsia-400 via-purple-500 to-indigo-500 bg-clip-text text-xl font-bold text-transparent md:text-2xl lg:text-3xl'
            >
              Bắt đầu quản lý tài chính của bạn ngay hôm nay
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className='mb-8 text-center text-sm text-gray-600 dark:text-gray-400'
            >
              Ứng dụng quản lý tài chính thông minh UNIKO của Lê Minh Tuấn giúp bạn theo dõi chi tiêu, phân tích tài chính và đạt mục tiêu tài chính cá nhân
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className='flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0'
            >
              <Button 
                size='lg' 
                className='bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
                onClick={() => window.location.href = '/auth/register'}
              >
                <span className="flex items-center">
                  Đăng ký miễn phí
                  <ArrowRight className='ml-2 h-4 w-4' />
                </span>
              </Button>
              <Button 
                variant='outline' 
                size='lg'
                onClick={() => window.location.href = '/#demo'}
              >
                Xem demo
              </Button>
            </motion.div>
          </div>
        </motion.section>

        {/* Footer with SEO-friendly links */}
        <footer className="bg-white px-4 py-12 dark:bg-slate-900 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                    <span className="text-sm font-bold">U</span>
                  </div>
                  <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">UNIKO</span>
                </div>
                <p className="max-w-xs text-sm text-gray-500 dark:text-gray-400">
                  Ứng dụng quản lý tài chính thông minh giúp theo dõi chi tiêu và phân tích tài chính với AI
                </p>
                <div className="flex space-x-4">
                  <a 
                    href="https://github.com/auroraphtgrp01" 
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub của Lê Minh Tuấn"
                    className="text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Tính năng</h3>
                <ul className="mt-4 space-y-2">
                  <li><a href="/#overview" className="text-sm text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400">Theo dõi chi tiêu</a></li>
                  <li><a href="/#overview" className="text-sm text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400">Phân tích tài chính</a></li>
                  <li><a href="/#overview" className="text-sm text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400">Trợ lý AI</a></li>
                  <li><a href="/#overview" className="text-sm text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400">Bảo mật dữ liệu</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Công ty</h3>
                <ul className="mt-4 space-y-2">
                  <li><a href="/#contributors" className="text-sm text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400">Đội ngũ phát triển</a></li>
                  <li><a href="/#" className="text-sm text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400">Về chúng tôi</a></li>
                  <li><a href="/#" className="text-sm text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400">Liên hệ</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Hỗ trợ</h3>
                <ul className="mt-4 space-y-2">
                  <li><a href="/#" className="text-sm text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400">Trung tâm trợ giúp</a></li>
                  <li><a href="/#" className="text-sm text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400">Chính sách bảo mật</a></li>
                  <li><a href="/#" className="text-sm text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400">Điều khoản sử dụng</a></li>
                </ul>
              </div>
            </div>

            <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
              <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} UNIKO. Phát triển bởi <a href="https://github.com/auroraphtgrp01" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline dark:text-indigo-400">Lê Minh Tuấn</a>. Tất cả các quyền được bảo lưu.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default memo(MainSection)
