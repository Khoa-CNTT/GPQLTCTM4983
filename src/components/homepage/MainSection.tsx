'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import HeroSection from '@/components/homepage/HeroSection'
import ContributorsSection from '@/components/homepage/ContributorsSection'
import { Spotlight } from '@/components/homepage/Spotlight'
import { TabStack } from '@/components/homepage/TabStack'
import Navbar from '@/components/homepage/Navbar'
import AvatarTuan from '@/images/contributors/Tuan.jpg'
import AvatarKhanh from '@/images/contributors/Khanh.jpg'
import AvatarHuy from '@/images/contributors/Huy.jpg'
import AvatarThanh from '@/images/contributors/Thanh.jpg'
import AvatarTrong from '@/images/contributors/Trong.jpg'
import AvatarTriet from '@/images/contributors/Triet.jpg'
import { BentoGridThird } from '@/components/homepage/Grid'
import { MarqueeReview } from '@/components/homepage/Marquee'
import { PlatformSection } from '@/components/homepage/PlatformSection'
import { Metadata } from 'next'
import Head from 'next/head'
import { IPhoneDemo } from './IPhoneDemo'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'UNIKO - Giải pháp quản lý tài chính thông minh',
  description:
    'UNIKO - Phần mềm quản lý tài chính thế hệ mới giúp bạn theo dõi, quản lý và tối ưu hóa tài chính một cách thông minh và hiệu quả.',
  keywords: 'quản lý tài chính, phần mềm tài chính, tài chính cá nhân, quản lý chi tiêu',
  openGraph: {
    title: 'UNIKO - Giải pháp quản lý tài chính thông minh',
    description:
      'UNIKO - Phần mềm quản lý tài chính thế hệ mới giúp bạn theo dõi, quản lý và tối ưu hóa tài chính một cách thông minh và hiệu quả.',
    images: ['/og-image.jpg']
  }
}

export default function MainSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50])

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

  return (
    <div className='relative min-h-screen w-full bg-gradient-to-b from-rose-50/20 via-white to-gray-50/70 dark:from-gray-950 dark:via-gray-900 dark:to-black'>
      {/* Background Effects - Refined & Subtle */}
      <div className='fixed inset-0 z-0 bg-grid-white/[0.02] dark:bg-grid-white/[0.01]'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.03),transparent_50%)]' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.03),transparent_50%)]' />
      </div>

      {/* Animated Particles - Made More Subtle */}
      <motion.div className='fixed inset-0 z-0 overflow-hidden' style={{ opacity }}>
        {Array.from({ length: 30 }).map((_, i) => (
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

        {/* Content Sections with Dividers */}
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
                Tính năng nổi bật
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

          {/* App Demo Section */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
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
                Khách hàng nói gì về chúng tôi
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className='mb-3 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-xl font-bold text-transparent md:text-2xl lg:text-3xl'
              >
                Đánh giá từ người dùng
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
              transition={{ duration: 0.5, delay: 0.2 }}
              className='mx-auto mb-7 max-w-xl text-xs text-gray-500 dark:text-gray-400 sm:text-sm'
            >
              Đăng ký miễn phí và trải nghiệm cách quản lý tài chính thông minh với UNIKO
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className='flex flex-col justify-center gap-3 sm:flex-row'
            >
              <Link href='/sign-in'>
                <Button className='w-full rounded-full bg-gradient-to-r from-fuchsia-400 to-indigo-400 px-7 py-2.5 text-xs text-white shadow-sm transition-all duration-300 hover:from-fuchsia-500 hover:to-indigo-500 hover:shadow-fuchsia-400/20 sm:w-auto'>
                  Bắt đầu miễn phí
                </Button>
              </Link>
              <Link href='#demo'>
                <Button
                  variant='outline'
                  className='w-full rounded-full border-gray-200 bg-white/40 px-7 py-2.5 text-xs text-gray-700 backdrop-blur-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-black/40 dark:text-gray-300 dark:hover:bg-gray-900/50 sm:w-auto'
                >
                  Xem demo
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className='border-t border-gray-100 px-4 py-8 dark:border-gray-800/50'>
          <div className='mx-auto flex max-w-7xl flex-col items-center justify-between md:flex-row'>
            <p className='text-xs text-gray-400 dark:text-gray-500'>
              © {new Date().getFullYear()} UNIKO. Mọi quyền được bảo lưu.
            </p>
            <div className='mt-4 flex items-center space-x-6 md:mt-0'>
              <a
                href='#'
                className='text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400'
              >
                Điều khoản sử dụng
              </a>
              <a
                href='#'
                className='text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400'
              >
                Chính sách bảo mật
              </a>
              <a
                href='https://github.com/auroraphtgrp01/fe-uniko'
                target='_blank'
                rel='noopener noreferrer'
                className='text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400'
              >
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
