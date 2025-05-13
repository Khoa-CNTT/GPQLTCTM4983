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

// Import HeroSection directly instead of lazy loading
import HeroSection from '@/components/homepage/HeroSection'

// Dynamically import heavyweight components
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

        {/* Footer with SEO-friendly links */}
        <footer className="relative overflow-hidden bg-white px-4 py-16 dark:bg-slate-900 sm:px-6 lg:px-8">
          {/* Background decorative elements */}
          <div className="absolute inset-0 -z-10 opacity-5">
            <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"></div>
            <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl"></div>
          </div>

          <div className="relative mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-10 pb-16 md:grid-cols-5">
              {/* Brand & Mission Section */}
              <div className="md:col-span-2 space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
                    <span className="text-base font-bold">U</span>
                    <div className="absolute inset-0 bg-white opacity-20 mix-blend-overlay"></div>
                  </div>
                  <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    UNIKO
                  </span>
                </div>
                
                <p className="max-w-sm text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  Ứng dụng quản lý tài chính thông minh giúp theo dõi chi tiêu và phân tích tài chính với AI. Đơn giản hóa tài chính cá nhân của bạn.
                </p>
                
                <div className="flex space-x-5">
                  <a 
                    href="https://github.com/auroraphtgrp01" 
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub của Lê Minh Tuấn"
                    className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all hover:bg-indigo-50 hover:text-indigo-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400"
                  >
                    <svg className="h-5 w-5 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 rounded-md bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-gray-700">GitHub</span>
                  </a>
                  
                  <a 
                    href="mailto:contact@uniko.app" 
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Email liên hệ"
                    className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all hover:bg-indigo-50 hover:text-indigo-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 rounded-md bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-gray-700">Email</span>
                  </a>
                </div>
              </div>

              {/* Links & Navigation */}
              <div className="md:col-span-3 grid grid-cols-1 gap-8 sm:grid-cols-3">
                <div className="space-y-4">
                  <div className="relative">
                    <h3 className="relative z-10 text-sm font-semibold uppercase tracking-wider text-gray-800 dark:text-gray-200">Tính năng</h3>
                    <div className="absolute -left-2 top-0 h-7 w-7 rounded-full bg-indigo-100 opacity-50 dark:bg-indigo-900/30"></div>
                  </div>
                  <ul className="space-y-3">
                    <li>
                      <a href="/#overview" className="group flex items-center text-sm text-gray-600 transition-all hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                        <span className="mr-2 h-0.5 w-0 bg-indigo-500 transition-all group-hover:w-2"></span>
                        Theo dõi chi tiêu
                      </a>
                    </li>
                    <li>
                      <a href="/#overview" className="group flex items-center text-sm text-gray-600 transition-all hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                        <span className="mr-2 h-0.5 w-0 bg-indigo-500 transition-all group-hover:w-2"></span>
                        Phân tích tài chính
                      </a>
                    </li>
                    <li>
                      <a href="/#overview" className="group flex items-center text-sm text-gray-600 transition-all hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                        <span className="mr-2 h-0.5 w-0 bg-indigo-500 transition-all group-hover:w-2"></span>
                        Trợ lý AI
                      </a>
                    </li>
                    <li>
                      <a href="/#overview" className="group flex items-center text-sm text-gray-600 transition-all hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                        <span className="mr-2 h-0.5 w-0 bg-indigo-500 transition-all group-hover:w-2"></span>
                        Bảo mật dữ liệu
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <h3 className="relative z-10 text-sm font-semibold uppercase tracking-wider text-gray-800 dark:text-gray-200">Công ty</h3>
                    <div className="absolute -left-2 top-0 h-7 w-7 rounded-full bg-purple-100 opacity-50 dark:bg-purple-900/30"></div>
                  </div>
                  <ul className="space-y-3">
                    <li>
                      <a href="/#contributors" className="group flex items-center text-sm text-gray-600 transition-all hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                        <span className="mr-2 h-0.5 w-0 bg-indigo-500 transition-all group-hover:w-2"></span>
                        Đội ngũ phát triển
                      </a>
                    </li>
                    <li>
                      <a href="/#" className="group flex items-center text-sm text-gray-600 transition-all hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                        <span className="mr-2 h-0.5 w-0 bg-indigo-500 transition-all group-hover:w-2"></span>
                        Về chúng tôi
                      </a>
                    </li>
                    <li>
                      <a href="/#" className="group flex items-center text-sm text-gray-600 transition-all hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                        <span className="mr-2 h-0.5 w-0 bg-indigo-500 transition-all group-hover:w-2"></span>
                        Liên hệ
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <h3 className="relative z-10 text-sm font-semibold uppercase tracking-wider text-gray-800 dark:text-gray-200">Hỗ trợ</h3>
                    <div className="absolute -left-2 top-0 h-7 w-7 rounded-full bg-fuchsia-100 opacity-50 dark:bg-fuchsia-900/30"></div>
                  </div>
                  <ul className="space-y-3">
                    <li>
                      <a href="/#" className="group flex items-center text-sm text-gray-600 transition-all hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                        <span className="mr-2 h-0.5 w-0 bg-indigo-500 transition-all group-hover:w-2"></span>
                        Trung tâm trợ giúp
                      </a>
                    </li>
                    <li>
                      <a href="/#" className="group flex items-center text-sm text-gray-600 transition-all hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                        <span className="mr-2 h-0.5 w-0 bg-indigo-500 transition-all group-hover:w-2"></span>
                        Chính sách bảo mật
                      </a>
                    </li>
                    <li>
                      <a href="/#" className="group flex items-center text-sm text-gray-600 transition-all hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                        <span className="mr-2 h-0.5 w-0 bg-indigo-500 transition-all group-hover:w-2"></span>
                        Điều khoản sử dụng
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom section with copyright */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-gradient-to-r from-white via-gray-50 to-white px-6 text-sm text-gray-500 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 dark:text-gray-400">
                  <span className="relative inline-flex items-center">
                    <span className="mr-2 inline-block h-3 w-3 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-75"></span>
                    UNIKO {new Date().getFullYear()}
                  </span>
                </span>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} UNIKO. Phát triển bởi <a href="https://github.com/auroraphtgrp01" target="_blank" rel="noopener noreferrer" className="relative inline-block font-medium text-indigo-600 transition-colors after:absolute after:-bottom-px after:left-0 after:h-px after:w-0 after:bg-indigo-600 after:transition-all hover:text-indigo-700 hover:after:w-full dark:text-indigo-400 dark:after:bg-indigo-400 dark:hover:text-indigo-300">Lê Minh Tuấn</a>. Tất cả các quyền được bảo lưu.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default memo(MainSection)
