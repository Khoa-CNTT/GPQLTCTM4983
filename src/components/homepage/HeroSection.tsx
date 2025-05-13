'use client'

import { useEffect, useState, useMemo, memo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Github,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Shield,
  ChevronDown,
  BarChart2,
  PieChart,
  Activity,
  Database,
  Star,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FlipWords } from '@/components/dashboard/flip-words'
import Link from 'next/link'
import { isLogin } from '@/libraries/helpers'
import { Spotlight } from './Spotlight'

// Animation variants to reduce duplicate code and improve performance
const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
}

const fadeInLeftVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
}

const fadeInRightVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 }
}

// Memo expensive components for better performance
const DashboardPreview = memo(() => {
  // Avoid unnecessary animations in reduced motion mode
  const prefersReducedMotion = useReducedMotion()
  
  return (
    <div className='relative overflow-hidden rounded-3xl border border-slate-100/60 bg-white shadow-xl dark:border-slate-800/60 dark:bg-slate-900 dark:shadow-slate-900/50'>
      {/* Dashboard Header */}
      <div className='flex items-center justify-between border-b border-slate-100 bg-white px-5 py-3 dark:border-slate-800 dark:bg-slate-900'>
        <div className='flex items-center gap-2'>
          <div className='flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 p-1'>
            <Database className='h-3 w-3 text-white' />
          </div>
          <span className='text-xs font-semibold text-slate-700 dark:text-slate-300'>
            UNIKO{' '}
            <span className='ml-1 rounded-sm bg-indigo-500/20 px-1 text-[8px] font-bold text-indigo-600 dark:text-indigo-300'>
              AI
            </span>
          </span>
        </div>
        <div className='flex gap-1.5'>
          <div className='h-3 w-3 rounded-full bg-rose-400'></div>
          <div className='h-3 w-3 rounded-full bg-amber-400'></div>
          <div className='h-3 w-3 rounded-full bg-emerald-400'></div>
        </div>
      </div>

      {/* Dashboard Content - Optimized animation triggers */}
      <div className='p-4'>
        {/* AI Assistant Banner - Simplified */}
        <motion.div
          variants={fadeInUpVariants}
          initial={prefersReducedMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className='mb-3 flex items-center justify-between rounded-lg border border-indigo-100 bg-gradient-to-r from-indigo-50 to-indigo-100/30 p-2 dark:border-indigo-900/30 dark:from-indigo-900/20 dark:to-indigo-800/10'
        >
          <div className='flex items-center gap-2'>
            <div className='flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 p-1'>
              <Sparkles className='h-3 w-3 text-white' />
            </div>
            <div>
              <div className='text-[10px] font-semibold text-indigo-700 dark:text-indigo-300'>AI Assistant</div>
              <div className='flex items-center'>
                <span className='text-[8px] text-slate-500 dark:text-slate-400'>Phân tích dữ liệu</span>
                <motion.div
                  animate={prefersReducedMotion ? {} : { opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className='ml-1 h-1.5 w-1.5 rounded-full bg-emerald-500'
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview - Simplified */}
        <div className='grid grid-cols-3 gap-2'>
          {useMemo(() => [
            {
              color: 'from-violet-500/20 to-violet-500/10',
              value: '+28.5%',
              label: 'Tăng trưởng',
              icon: <TrendingUp className='h-3 w-3 text-violet-600 dark:text-violet-400' />
            },
            {
              color: 'from-indigo-500/20 to-indigo-500/10',
              value: '2.4M',
              label: 'Tổng tài sản',
              icon: <Database className='h-3 w-3 text-indigo-600 dark:text-indigo-400' />
            },
            {
              color: 'from-rose-500/20 to-rose-500/10',
              value: '86/100',
              label: 'Hiệu suất',
              icon: <Activity className='h-3 w-3 text-rose-600 dark:text-rose-400' />
            }
          ], []).map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeInUpVariants}
              initial={prefersReducedMotion ? "visible" : "hidden"}
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: prefersReducedMotion ? 0 : 0.1 * i }}
              className={`rounded-xl bg-gradient-to-br ${stat.color} p-2 dark:bg-opacity-30`}
            >
              <div className='mb-1 flex items-center justify-between'>
                <span className='text-xs font-medium text-slate-600 dark:text-slate-400'>{stat.label}</span>
                {stat.icon}
              </div>
              <div className='text-base font-bold text-slate-800 dark:text-white'>{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Chart Section - Optimized with memoization */}
        <motion.div
          variants={fadeInUpVariants}
          initial={prefersReducedMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: prefersReducedMotion ? 0 : 0.3 }}
          className='mt-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-3 dark:from-slate-800/80 dark:to-slate-900'
        >
          <div className='mb-2 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className='flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600'>
                <BarChart2 className='h-3 w-3 text-white' />
              </div>
              <span className='text-xs font-semibold text-slate-700 dark:text-slate-300'>
                Phân tích <span className='text-indigo-500'>AI</span>
              </span>
            </div>
            <div className='flex gap-2'>
              {useMemo(() => ['1D', '1W', '1M', '1Y'].map((period, i) => (
                <span
                  key={i}
                  className={`text-xs ${i === 2 ? 'rounded-md bg-gradient-to-r from-indigo-500 to-violet-500 px-1.5 py-0.5 font-medium text-white' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  {period}
                </span>
              )), [])}
            </div>
          </div>

          {/* Chart visualization with simplified bars - using React.memo for better performance */}
          <div className='h-28 w-full rounded-md bg-slate-50/50 dark:bg-slate-800/20'>
            <div className='relative h-[80%] w-full'>
              {/* Main chart with bars - simplified animation */}
              <div className='flex h-full items-end justify-between gap-1 p-1'>
                {useMemo(() => [40, 25, 35, 45, 35, 55, 45, 60, 75, 70, 65, 80].map((height, i) => (
                  <div key={i} className='relative flex h-full w-full flex-col justify-end'>
                    <motion.div
                      initial={prefersReducedMotion ? { height: `${height}%` } : { height: 0 }}
                      whileInView={{ height: `${height}%` }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.4, 
                        delay: prefersReducedMotion ? 0 : 0.5 + Math.min(i * 0.03, 0.3) 
                      }}
                      className={`w-full rounded-sm ${i % 3 === 0 ? 'bg-violet-500' : i % 3 === 1 ? 'bg-indigo-500' : 'bg-rose-500'} shadow-sm`}
                    />
                    
                    {/* Highlights with conditional rendering */}
                    {i >= 9 && (
                      <motion.div
                        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: prefersReducedMotion ? 0 : 0.7 }}
                        className='absolute -top-1 right-0 h-1.5 w-1.5 rounded-full bg-yellow-400 shadow-sm shadow-yellow-400/50'
                      />
                    )}
                  </div>
                )), [])}
              </div>

              {/* AI trend line */}
              <motion.div
                initial={prefersReducedMotion ? { opacity: 1, width: '100%' } : { opacity: 0, width: 0 }}
                whileInView={{ opacity: 1, width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.7 }}
                className='absolute left-0 right-0 top-[30%] h-[1px] w-full border-t-2 border-dashed border-indigo-500'
              />

              {/* AI badge */}
              <motion.div
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 5 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: prefersReducedMotion ? 0 : 0.8 }}
                className='absolute -right-1 -top-1 rounded-sm bg-indigo-500 px-1 py-0.5 text-[6px] font-medium text-white shadow-sm'
              >
                AI
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Simplified Transactions with memoization */}
        <motion.div
          variants={fadeInUpVariants}
          initial={prefersReducedMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: prefersReducedMotion ? 0 : 0.4 }}
          className='mt-3'
        >
          <div className='mb-2 flex items-center justify-between'>
            <span className='text-xs font-semibold text-slate-700 dark:text-slate-300'>Giao dịch gần đây</span>
            <div className='rounded-sm bg-indigo-100 px-1 text-[8px] font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'>
              AI phân loại
            </div>
          </div>

          {/* Transaction list with optimized rendering */}
          <div className='space-y-2'>
            {useMemo(() => [
              {
                name: 'Tiết kiệm định kỳ',
                amount: '+2,450,000₫',
                type: 'deposit',
                aiTag: 'Smart'
              },
              {
                name: 'Cafe Highland',
                amount: '-85,000₫',
                type: 'expense',
                aiTag: 'Routine'
              },
              {
                name: 'Lương tháng 8',
                amount: '+15,000,000₫',
                type: 'income',
                aiTag: '+5%'
              }
            ], []).map((transaction, i) => (
              <motion.div
                key={i}
                variants={fadeInUpVariants}
                initial={prefersReducedMotion ? "visible" : "hidden"}
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: prefersReducedMotion ? 0 : 0.5 + i * 0.1 }}
                className='flex items-center justify-between rounded-lg border border-slate-100 p-2 dark:border-slate-800'
              >
                <div className='flex items-center gap-2'>
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full ${transaction.type === 'deposit' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : 'bg-gradient-to-br from-rose-400 to-rose-600'} p-1`}>
                    {transaction.type === 'deposit' ? <TrendingUp className='h-3 w-3 text-white' /> : transaction.type === 'income' ? <ArrowRight className='h-3 w-3 text-white' /> : <Star className='h-3 w-3 text-white' />}
                  </div>
                  <div>
                    <div className='text-xs font-medium text-slate-700 dark:text-slate-300'>{transaction.name}</div>
                    <div className='flex items-center'>
                      <span className='text-[9px] text-slate-500 dark:text-slate-400'>Hôm nay</span>
                      <span className='mx-1 h-0.5 w-0.5 rounded-full bg-slate-300 dark:bg-slate-600'></span>
                      <span className='text-[9px] text-slate-500 dark:text-slate-400'>10:30</span>
                    </div>
                  </div>
                </div>
                <div className='text-right'>
                  <div className={`text-xs font-semibold ${transaction.type === 'deposit' ? 'text-emerald-600 dark:text-emerald-400' : transaction.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {transaction.amount}
                  </div>
                  <div className='flex items-center justify-end gap-1'>
                    <span className='text-[8px] text-slate-500 dark:text-slate-400'>{transaction.aiTag}</span>
                    <Zap className='h-2 w-2 text-amber-500' />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
})

// Add display name for React DevTools
DashboardPreview.displayName = 'DashboardPreview';

export default memo(function HeroSection() {
  const isLoginUser = isLogin()
  // Use reduced motion setting to respect user preferences
  const prefersReducedMotion = useReducedMotion()
  
  // Common transition settings to reduce code duplication
  const commonTransition = { duration: 0.4, ease: "easeOut" }
  
  // Memoize expensive calculations
  const featureItems = useMemo(() => [
    {
      icon: <TrendingUp className="h-4 w-4 text-indigo-500" />,
      label: "Theo dõi chi tiêu"
    },
    {
      icon: <PieChart className="h-4 w-4 text-violet-500" />,
      label: "Phân tích tài chính"
    },
    {
      icon: <Sparkles className="h-4 w-4 text-amber-500" />,
      label: "Trợ lý AI thông minh"
    },
    
  ], []);
  
  return (
    <section className='relative min-h-screen overflow-hidden'>
      {/* Background Elements - Simplified */}
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent'></div>

      {/* Spotlight with reduced opacity */}
      <Spotlight className='left-0 top-0 opacity-20 md:opacity-30' fill='#FFF8E1' />

      {/* 3D Background Effect - More lightweight */}
      <div className='absolute inset-0'>
        <div className='absolute inset-0 bg-[linear-gradient(rgba(244,63,94,0.01)_1px,transparent_1px),linear-gradient(to_right,rgba(244,63,94,0.01)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]' />
      </div>

      <div className='relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-20 text-center md:px-10'>
        <div className='grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8 lg:gap-14'>
          {/* Left column - Main text content */}
          <motion.div
            variants={fadeInLeftVariants}
            initial={prefersReducedMotion ? "visible" : "hidden"}
            animate="visible"
            transition={commonTransition}
            className='flex flex-col items-center justify-center space-y-6 md:items-start md:text-left'
          >
            {/* Logo Badge - Simplified */}
            <div className='mb-2 inline-flex items-center gap-1.5 rounded-full border border-violet-100 bg-white/90 px-3 py-1.5 shadow-sm dark:border-violet-900/30 dark:bg-black/60'>
              <div className='flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 p-1'>
                <Star className='h-2.5 w-2.5 text-white' strokeWidth={2.5} />
              </div>
              <span className='text-xs font-medium text-violet-900 dark:text-violet-200'>The Financial Revolution</span>
            </div>

            {/* Main Title - Simplified animations */}
            <div className='relative space-y-3'>
              <motion.h2
                variants={fadeInUpVariants}
                initial={prefersReducedMotion ? "visible" : "hidden"}
                animate="visible"
                transition={{ ...commonTransition, delay: prefersReducedMotion ? 0 : 0.1 }}
                className='text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl lg:text-5xl'
              >
                <div className='flex items-center gap-2 sm:items-end'>
                  <span className='relative block bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text pb-1 text-transparent dark:from-indigo-300 dark:via-violet-400 dark:to-purple-300'>
                    Giải pháp
                  </span>
                  <div className='hidden rounded-lg bg-gradient-to-r from-violet-500/20 to-indigo-500/20 px-3 py-1 text-base font-semibold text-violet-700 dark:from-violet-500/30 dark:to-indigo-500/30 dark:text-violet-300 sm:inline-block'>
                    #1
                  </div>
                </div>
                <span className='mt-1 block text-violet-600 dark:text-white'>quản lý tài chính</span>
              </motion.h2>

              <div className='relative inline-flex items-center gap-1.5 rounded-full border border-rose-100 bg-white/90 px-3 py-1.5 shadow-sm dark:border-rose-900/30 dark:bg-black/50'>
                <Zap className='h-3.5 w-3.5 text-rose-500 dark:text-rose-400' />
                <FlipWords
                  className='text-sm font-medium text-rose-600 dark:text-rose-300 sm:text-base'
                  duration={4000}
                  words={['thành công bền vững ✨', 'phát triển tương lai', 'làm chủ tài chính']}
                />
              </div>
            </div>

            {/* Description - No animation for better performance */}
            <p className='relative max-w-xl text-sm text-violet-600/90 dark:text-white/80 sm:text-base'>
              <span className='absolute -left-6 top-0 text-4xl opacity-20'>❝</span>
              Phần mềm quản lý tài chính thế hệ mới giúp bạn theo dõi, quản lý và tối ưu hóa tài chính một cách thông
              minh.
              <span className='absolute -bottom-6 right-0 text-4xl opacity-20'>❞</span>
            </p>

            {/* Features - Simplified with single parent animation */}
            <motion.div 
              variants={fadeInUpVariants}
              initial={prefersReducedMotion ? "visible" : "hidden"}
              animate="visible"
              transition={{ ...commonTransition, delay: prefersReducedMotion ? 0 : 0.2 }}
              className='mt-2 grid w-full grid-cols-1 gap-3 sm:grid-cols-3'
            >
              {featureItems.map((feature, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center rounded-xl border border-slate-100 bg-gradient-to-br from-indigo-500/20 p-3 shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-800/60 dark:bg-opacity-30 sm:items-start`}
                >
                  <div className='mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm dark:bg-slate-800/90'>
                    {feature.icon}
                  </div>
                  <p className='mt-2 text-sm font-semibold text-slate-700 dark:text-white'>{feature.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Social Proof - Simplified */}
            <div className='flex w-full items-center justify-between rounded-xl border border-slate-100 bg-gradient-to-b from-white to-slate-50/80 p-3 dark:border-slate-800/60 dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-800/60'>
              <div className='flex flex-col'>
                <div className='flex items-center'>
                  <div className='flex'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < 4 ? 'text-amber-400' : 'text-amber-400/50'}`}
                        fill={i < 4 ? 'currentColor' : 'none'}
                        strokeWidth={i < 4 ? 1 : 1.5}
                      />
                    ))}
                  </div>
                  <span className='ml-1.5 text-xs text-violet-600 dark:text-violet-400'>4.8/5</span>
                </div>
                <span className='text-xs font-medium text-slate-600 dark:text-slate-400'>
                  Được tin dùng bởi các chuyên gia tài chính
                </span>
              </div>
              <div className='flex -space-x-2'>
                {[
                  { bg: 'bg-blue-500', label: 'VCB' },
                  { bg: 'bg-red-500', label: 'TCB' },
                  { bg: 'bg-green-500', label: 'ACB' },
                  { bg: 'bg-yellow-500', label: 'VIB' }
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white ${item.bg} text-[9px] font-bold text-white shadow-sm dark:border-slate-800`}
                  >
                    {item.label}
                  </div>
                ))}
                <div
                  className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-violet-500 to-indigo-600 text-[9px] font-medium text-white shadow-sm dark:border-slate-800'
                >
                  +42
                </div>
              </div>
            </div>

            {/* Author & Welcome - Only render if logged in */}
            {isLoginUser && (
              <div className='w-full rounded-xl border border-violet-100/50 bg-gradient-to-br from-violet-50/80 to-white p-3 dark:border-violet-900/40 dark:from-violet-900/30 dark:to-transparent'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 p-1 text-white'>
                    {isLoginUser.fullName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className='text-sm font-medium text-slate-800 dark:text-white'>Welcome back!</p>
                    <p className='text-xs text-violet-600 dark:text-violet-300'>
                      {isLoginUser.fullName} <span className='inline-block text-yellow-400'>✨</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CTA Buttons - Simplified */}
            <motion.div
              variants={fadeInUpVariants}
              initial={prefersReducedMotion ? "visible" : "hidden"}
              animate="visible"
              transition={{ ...commonTransition, delay: prefersReducedMotion ? 0 : 0.3 }}
              className='mt-2 flex w-full flex-col gap-3 sm:flex-row sm:gap-4'
            >
              {isLoginUser ? (
                <div className='group relative z-10 w-full sm:w-auto'>
                  <div className='absolute -inset-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 opacity-75 transition-all duration-300 group-hover:opacity-100'></div>
                  <Button 
                    className='relative w-full overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-6 text-sm font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 sm:py-2.5'
                    onClick={() => window.location.href = '/dashboard/tracker-transaction'}
                  >
                    <span className="flex items-center">
                      <span className='relative z-10'>Đến Dashboard</span>
                      <ArrowRight className='relative z-10 ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5' />
                    </span>
                  </Button>
                </div>
              ) : (
                <div className='group relative z-10 w-full sm:w-auto'>
                  <div className='absolute -inset-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 opacity-75 transition-all duration-300 group-hover:opacity-100'></div>
                  <Button 
                    className='relative w-full overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-6 text-sm font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 sm:py-2.5'
                    onClick={() => window.location.href = '/sign-in'}
                  >
                    <span className="flex items-center">
                      <span className='relative z-10'>Bắt đầu miễn phí</span>
                      <ArrowRight className='relative z-10 ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5' />
                    </span>
                  </Button>
                </div>
              )}

              <div className='group relative z-10 w-full sm:w-auto'>
                <div className='absolute -inset-0.5 rounded-full bg-gradient-to-r from-slate-200 to-slate-300 opacity-70 transition-all duration-300 group-hover:opacity-100 dark:from-slate-800 dark:to-slate-700'></div>
                <Button
                  variant='outline'
                  className='relative w-full rounded-full border-slate-200 bg-white px-6 py-6 text-sm font-medium text-slate-700 transition-all duration-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 sm:py-2.5'
                  onClick={() => window.open('https://github.com/auroraphtgrp01/fe-uniko', '_blank')}
                >
                  <span className="flex items-center">
                    <Github className='mr-1.5 h-3.5 w-3.5 transition-transform group-hover:rotate-6' />
                    GitHub
                  </span>
                </Button>
              </div>
            </motion.div>

            {/* Created By - No animation */}
            <div className='mt-2 text-xs font-medium text-slate-500/70 dark:text-white/50'>
              <span className='inline-flex items-center gap-1'>
                <span>Created with</span>
                <span className='text-rose-400'>❤️</span>
                <span>by Le Minh Tuan</span>
              </span>
            </div>
          </motion.div>

          {/* Right column - Dashboard preview without lazy loading */}
          <motion.div
            variants={fadeInRightVariants}
            initial={prefersReducedMotion ? "visible" : "hidden"}
            animate="visible"
            transition={{ ...commonTransition, delay: prefersReducedMotion ? 0 : 0.2 }}
            className='relative h-auto w-full md:block'
          >
            <div className="mb-4 rounded-xl border border-violet-100/50 bg-white p-4 shadow-sm dark:border-violet-800/30 dark:bg-slate-900/80">
              <h3 className="mb-2 text-lg font-semibold text-violet-700 dark:text-violet-300">Tài chính thông minh</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Hệ thống AI phân tích chi tiêu và đề xuất cách tối ưu quản lý tài chính của bạn.</p>
            </div>
            
            <DashboardPreview />
          </motion.div>
        </div>

        {/* Scroll Indicator - Simplified */}
        <div className='absolute bottom-8 left-1/2 -translate-x-1/2 transform'>
          <motion.div
            animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className='flex flex-col items-center space-y-2'
          >
            <span className='text-xs text-gray-500 dark:text-gray-400'>Cuộn xuống</span>
            <ChevronDown className='h-4 w-4 text-gray-500 dark:text-gray-400' />
          </motion.div>
        </div>
      </div>
    </section>
  )
})
