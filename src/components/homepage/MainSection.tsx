'use client'

import { useRef, useEffect, memo, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { initPerformanceOptimizations } from '@/libraries/performance-optimization'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

// Import static assets


// Import HeroSection directly instead of lazy loading
import HeroSection from '@/components/homepage/HeroSection'

// Dynamically import heavyweight components

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



const MainSection = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50])
  
  // Thêm state cho scroll to top
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Thêm effect để theo dõi scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Hàm xử lý scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // Parallax effects for background
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const gridOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.7])

  // Initialize performance optimizations when component mounts
  useEffect(() => {
    initPerformanceOptimizations()
  }, [])

  return (
    <div className='relative min-h-screen w-full bg-gradient-to-b from-rose-50/20 via-white to-gray-50/70 dark:from-gray-950 dark:via-gray-900 dark:to-black'>
      {/* Background Effects - Enhanced & More Visible */}
      <motion.div 
        className='fixed inset-0 z-0 bg-grid-white/[0.05] dark:bg-grid-white/[0.03]'
        style={{ y: bgY, opacity: gridOpacity }}
      >
        {/* Colorful gradient orbs with animation */}
        <motion.div 
          className='absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.06),transparent_50%)]'
          animate={{ 
            opacity: [0.5, 0.7, 0.5],
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        <motion.div 
          className='absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.06),transparent_50%)]'
          animate={{ 
            opacity: [0.6, 0.8, 0.6],
            scale: [1, 1.03, 1],
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
        />
        
        {/* Additional gradient for more depth */}
        <motion.div 
          className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(226,138,255,0.04),transparent_70%)]'
          animate={{ 
            opacity: [0.4, 0.6, 0.4],
            scale: [1.1, 1, 1.1],
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2,
          }}
        />
      </motion.div>

      {/* Enhanced Animated Particles - More variety and better animation */}
      <motion.div className='fixed inset-0 z-0 overflow-hidden' style={{ opacity }}>
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute ${i % 3 === 0 ? 'h-1.5 w-1.5' : 'h-1 w-1'} rounded-full ${
              i % 5 === 0 
                ? 'bg-gradient-to-r from-violet-300 to-indigo-300' 
                : i % 4 === 0 
                  ? 'bg-gradient-to-r from-fuchsia-300 to-purple-300'
                  : 'bg-gradient-to-b from-violet-300 to-violet-300'
            } opacity-40 backdrop-blur-sm`}
            animate={{
              x: [
                Math.random() * window.innerWidth, 
                Math.random() * window.innerWidth
              ],
              y: [
                Math.random() * window.innerHeight, 
                Math.random() * window.innerHeight
              ],
              scale: [0, Math.random() * 0.5 + 0.5, 0],
              opacity: [0, Math.random() * 0.4 + 0.2, 0],
              rotate: [0, Math.random() * 360]
            }}
            transition={{
              duration: Math.random() * 15 + 8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 5
            }}
          />
        ))}
      </motion.div>

      {/* Main Content */}
      <div className='relative z-10'>
        <Navbar />

        {/* Thêm nút Scroll To Top */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 text-indigo-600 shadow-lg transition-all hover:from-violet-200 hover:to-indigo-200 hover:text-indigo-700 dark:from-violet-900/30 dark:to-indigo-900/30 dark:text-indigo-400 dark:hover:from-violet-800/40 dark:hover:to-indigo-800/40 dark:hover:text-indigo-300"
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 -z-10 rounded-lg bg-white/10 blur-sm"
                animate={{
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                animate={{
                  y: [0, -1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </motion.svg>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Hero Section with Enhanced Scroll Animation */}
        <motion.div 
          className='relative' 
          id="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <HeroSection />
        </motion.div>

        {/* Content Sections with Enhanced Animations */}
        <div className='mx-auto max-w-7xl space-y-28 px-4 py-16 sm:px-6 lg:px-8'>
          {/* Feature Overview Section */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
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
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: 'rgba(238, 242, 255, 0.9)',
                  boxShadow: '0 0 15px rgba(139, 92, 246, 0.2)',
                }}
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
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            id='platform'
            className='relative pt-8'
          >
            <PlatformSection />
          </motion.section>

          {/* App Demo Section - Enhanced animations */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            id='demo'
            className='relative scroll-m-20 py-12'
            whileHover={{ scale: 1.01 }}
          >
            <IPhoneDemo />
          </motion.section>

          {/* User Reviews */}
          {/* <motion.section
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
          </motion.section> */}


        </div>

        {/* Footer with Enhanced animations */}
        <footer className="relative overflow-hidden bg-white px-4 py-16 dark:bg-slate-900 sm:px-6 lg:px-8">
          {/* Background decorative elements - more dynamic */}
          <div className="absolute inset-0 -z-10 opacity-5">
            <motion.div 
              className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            ></motion.div>
            <motion.div 
              className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1
              }}
            ></motion.div>
          </div>

          <div className="relative mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-10 pb-16 md:grid-cols-5">
              {/* Brand & Mission Section */}
              <div className="md:col-span-2 space-y-6">
                <motion.div 
                  className="flex items-center space-x-3"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
                    <span className="text-base font-bold">U</span>
                    <div className="absolute inset-0 bg-white opacity-20 mix-blend-overlay"></div>
                  </div>
                  <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    UNIKO
                  </span>
                </motion.div>
                
                <p className="max-w-sm text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  Ứng dụng quản lý tài chính thông minh giúp theo dõi chi tiêu và phân tích tài chính với AI. Đơn giản hóa tài chính cá nhân của bạn.
                </p>
                

              </div>

              {/* Links & Navigation - Enhanced with animations */}
              <div className="md:col-span-3 grid grid-cols-1 gap-8 sm:grid-cols-3">
                <div className="space-y-4">
                  <div className="relative">
                    <motion.h3 
                      whileHover={{ x: 3 }}
                      className="relative z-10 text-sm font-semibold uppercase tracking-wider text-gray-800 dark:text-gray-200"
                    >
                      Tính năng
                    </motion.h3>
                    <motion.div 
                      className="absolute -left-2 top-0 h-7 w-7 rounded-full bg-indigo-100 opacity-50 dark:bg-indigo-900/30"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.7, 0.5] 
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    ></motion.div>
                  </div>
                  <ul className="space-y-3">
                    <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                      <a href="/#overview" className="group flex items-center text-sm text-gray-600 transition-all hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                        <span className="mr-2 h-0.5 w-0 bg-indigo-500 transition-all group-hover:w-2"></span>
                        Theo dõi chi tiêu
                      </a>
                    </motion.li>
                    <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                      <a href="/#overview" className="group flex items-center text-sm text-gray-600 transition-all hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                        <span className="mr-2 h-0.5 w-0 bg-indigo-500 transition-all group-hover:w-2"></span>
                        Phân tích tài chính
                      </a>
                    </motion.li>
                    <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                      <a href="/#overview" className="group flex items-center text-sm text-gray-600 transition-all hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                        <span className="mr-2 h-0.5 w-0 bg-indigo-500 transition-all group-hover:w-2"></span>
                        Trợ lý AI
                      </a>
                    </motion.li>
                    <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                      <a href="/#overview" className="group flex items-center text-sm text-gray-600 transition-all hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                        <span className="mr-2 h-0.5 w-0 bg-indigo-500 transition-all group-hover:w-2"></span>
                        Bảo mật dữ liệu
                      </a>
                    </motion.li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <motion.h3 
                      whileHover={{ x: 3 }}
                      className="relative z-10 text-sm font-semibold uppercase tracking-wider text-gray-800 dark:text-gray-200"
                    >
                      Công ty
                    </motion.h3>
                    <motion.div 
                      className="absolute -left-2 top-0 h-7 w-7 rounded-full bg-purple-100 opacity-50 dark:bg-purple-900/30"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.7, 0.5] 
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: 0.5
                      }}
                    ></motion.div>
                  </div>
                  <ul className="space-y-3">

                    <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                      <a href="/#" className="group flex items-center text-sm text-gray-600 transition-all hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                        <span className="mr-2 h-0.5 w-0 bg-indigo-500 transition-all group-hover:w-2"></span>
                        Về chúng tôi
                      </a>
                    </motion.li>
                    <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                      <a href="/#" className="group flex items-center text-sm text-gray-600 transition-all hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                        <span className="mr-2 h-0.5 w-0 bg-indigo-500 transition-all group-hover:w-2"></span>
                        Liên hệ
                      </a>
                    </motion.li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <motion.h3 
                      whileHover={{ x: 3 }}
                      className="relative z-10 text-sm font-semibold uppercase tracking-wider text-gray-800 dark:text-gray-200"
                    >
                      Hỗ trợ
                    </motion.h3>
                    <motion.div 
                      className="absolute -left-2 top-0 h-7 w-7 rounded-full bg-fuchsia-100 opacity-50 dark:bg-fuchsia-900/30"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.7, 0.5] 
                      }}
                      transition={{ 
                        duration: 3.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: 1
                      }}
                    ></motion.div>
                  </div>
                  <ul className="space-y-3">
                    <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                      <a href="/#" className="group flex items-center text-sm text-gray-600 transition-all hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                        <span className="mr-2 h-0.5 w-0 bg-indigo-500 transition-all group-hover:w-2"></span>
                        Trung tâm trợ giúp
                      </a>
                    </motion.li>
                    <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                      <a href="/#" className="group flex items-center text-sm text-gray-600 transition-all hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                        <span className="mr-2 h-0.5 w-0 bg-indigo-500 transition-all group-hover:w-2"></span>
                        Chính sách bảo mật
                      </a>
                    </motion.li>
                    <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                      <a href="/#" className="group flex items-center text-sm text-gray-600 transition-all hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                        <span className="mr-2 h-0.5 w-0 bg-indigo-500 transition-all group-hover:w-2"></span>
                        Điều khoản sử dụng
                      </a>
                    </motion.li>
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
                <motion.span 
                  className="bg-gradient-to-r from-white via-gray-50 to-white px-6 text-sm text-gray-500 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 dark:text-gray-400"
                  whileHover={{ 
                    scale: 1.05,
                    transition: { 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 10 
                    }
                  }}
                >
                  <span className="relative inline-flex items-center">
                    <motion.span 
                      className="mr-2 inline-block h-3 w-3 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-75"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7] 
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity
                      }}
                    ></motion.span>
                    UNIKO {new Date().getFullYear()}
                  </span>
                </motion.span>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <motion.p 
                className="text-xs text-gray-500 dark:text-gray-400"
                whileHover={{ 
                  color: "#4F46E5",
                  transition: { duration: 0.3 } 
                }}
              >
                &copy; {new Date().getFullYear()} UNIKO. Tất cả các quyền được bảo lưu.
              </motion.p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default memo(MainSection)
