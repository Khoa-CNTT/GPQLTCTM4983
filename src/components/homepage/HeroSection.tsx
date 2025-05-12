'use client'

import { motion } from 'framer-motion'
import { Github, ArrowRight, Sparkles, TrendingUp, Shield, ChevronDown, BarChart2, PieChart, Activity, Database, Star, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FlipWords } from '@/components/dashboard/flip-words'
import Link from 'next/link'
import { isLogin } from '@/libraries/helpers'
import { Spotlight } from './Spotlight'

export default function HeroSection() {
  const isLoginUser = isLogin()

  return (
    <section className='relative min-h-screen overflow-hidden'>
      {/* Background Elements - Updated */}
      <div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent pointer-events-none'></div>
      
      {/* Spotlight in the top-left corner */}
      <Spotlight className="top-0 left-0 opacity-30 md:opacity-40" fill="#FFF8E1" />
      
      {/* 3D Background Effect - More subtle */}
      <div className='absolute inset-0'>
        {/* 3D Grid effect */}
        <div className='absolute inset-0 bg-[linear-gradient(rgba(244,63,94,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(244,63,94,0.02)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]' />
      </div>

      <div className='relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-20 text-center md:px-10'>
        <div className='grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8 lg:gap-14'>
          {/* Left column - Main text content - UPDATED */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className='flex flex-col items-center justify-center space-y-6 md:items-start md:text-left'
          >
            {/* Logo Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className='mb-2 inline-flex items-center gap-1.5 rounded-full border border-violet-100 bg-white/90 px-3 py-1.5 shadow-sm dark:border-violet-900/30 dark:bg-black/60'
            >
              <div className='flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 p-1'>
                <Star className='h-2.5 w-2.5 text-white' strokeWidth={2.5} />
              </div>
              <span className='text-xs font-medium text-violet-900 dark:text-violet-200'>The Financial Revolution</span>
            </motion.div>
            
            {/* Main Title - Refined */}
            <div className='relative space-y-3'>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className='text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl lg:text-5xl'
              >
                <div className='flex items-center gap-2 sm:items-end'>
                  <span className='relative block bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text pb-1 text-transparent dark:from-indigo-300 dark:via-violet-400 dark:to-purple-300'>
                    Giải pháp 
                  </span>
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className='hidden rounded-lg bg-gradient-to-r from-violet-500/20 to-indigo-500/20 px-3 py-1 text-base font-semibold text-violet-700 dark:from-violet-500/30 dark:to-indigo-500/30 dark:text-violet-300 sm:inline-block'
                  >
                    #1
                  </motion.div>
                </div>
                <span className='mt-1 block text-violet-600 dark:text-white'>quản lý tài chính</span>
              </motion.h2>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className='relative inline-flex items-center gap-1.5 rounded-full border border-rose-100 bg-white/90 px-3 py-1.5 shadow-sm dark:border-rose-900/30 dark:bg-black/50'
              >
                <Zap className='h-3.5 w-3.5 text-rose-500 dark:text-rose-400' />
                <FlipWords
                  className='text-sm font-medium text-rose-600 dark:text-rose-300 sm:text-base'
                  duration={4000}
                  words={['thành công bền vững', 'phát triển tương lai', 'làm chủ tài chính']}
                />
              </motion.div>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className='relative max-w-xl text-sm text-violet-600/90 dark:text-white/80 sm:text-base'
            >
              <span className='absolute -left-6 top-0 text-4xl opacity-20'>❝</span>
              Phần mềm quản lý tài chính thế hệ mới giúp bạn theo dõi, quản lý và tối ưu hóa tài chính một cách thông
              minh.
              <span className='absolute -bottom-6 right-0 text-4xl opacity-20'>❞</span>
            </motion.p>

            {/* Features - Updated */}
            <div className='mt-2 grid w-full grid-cols-1 gap-3 sm:grid-cols-3'>
              {[
                {
                  icon: <Sparkles className='h-4 w-4 text-rose-400' />,
                  text: 'Quản lý thông minh',
                  description: 'Hệ thống AI tracking',
                  color: 'from-rose-500/20 to-rose-500/5'
                },
                {
                  icon: <TrendingUp className='h-4 w-4 text-indigo-500' />,
                  text: 'Phân tích chuyên sâu',
                  description: 'Insight data analysis',
                  color: 'from-indigo-500/20 to-indigo-500/5'
                },
                {
                  icon: <Shield className='h-4 w-4 text-violet-500' />,
                  text: 'Bảo mật tuyệt đối',
                  description: 'Mã hóa đa lớp',
                  color: 'from-violet-500/20 to-violet-500/5'
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className={`flex flex-col items-center rounded-xl border border-slate-100 bg-gradient-to-br ${feature.color} p-3 shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-800/60 dark:bg-opacity-30 sm:items-start`}
                >
                  <div className='mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm dark:bg-slate-800/90'>
                    {feature.icon}
                  </div>
                  <p className='mt-2 text-sm font-semibold text-slate-700 dark:text-white'>{feature.text}</p>
                  <p className='text-xs text-slate-600/70 dark:text-slate-400'>{feature.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className='flex w-full items-center justify-between rounded-xl border border-slate-100 bg-white/90 p-3 dark:border-slate-800/60 dark:bg-slate-900/60'
            >
              <div className='flex flex-col'>
                <span className='text-xs font-medium text-slate-600 dark:text-slate-400'>Trusted by</span>
                <span className='text-sm font-bold text-slate-800 dark:text-white'>10,000+ users</span>
              </div>
              <div className='flex -space-x-2'>
                {[
                  'bg-rose-400',
                  'bg-indigo-400',
                  'bg-violet-400',
                  'bg-teal-400',
                ].map((color, i) => (
                  <div key={i} className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white ${color} text-xs font-medium text-white dark:border-slate-800`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
                <div className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xs font-medium text-slate-800 dark:border-slate-800 dark:bg-slate-700 dark:text-white'>
                  +99
                </div>
              </div>
            </motion.div>

            {/* Author & Welcome - Updated */}
            {isLoginUser && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className='w-full rounded-xl border border-violet-100/50 bg-gradient-to-br from-violet-50/80 to-white p-3 dark:border-violet-900/40 dark:from-violet-900/30 dark:to-transparent'
              >
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 p-1 text-white'>
                    {isLoginUser.fullName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className='text-sm font-medium text-slate-800 dark:text-white'>Welcome back!</p>
                    <p className='text-xs text-violet-600 dark:text-violet-300'>
                      {isLoginUser.fullName} <span className="inline-block text-yellow-400">✨</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CTA Buttons - Updated */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className='mt-2 flex w-full flex-col gap-3 sm:flex-row sm:gap-4'
            >
              {isLoginUser ? (
                <Link className='group relative z-10 w-full sm:w-auto' href='/dashboard/tracker-transaction'>
                  <div className='absolute -inset-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 opacity-75 transition-all duration-300 group-hover:opacity-100'></div>
                  <Button className='relative w-full overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-6 text-sm font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 sm:py-2.5'>
                    <span className='relative z-10'>Đến Dashboard</span>
                    <ArrowRight className='relative z-10 ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5' />
                  </Button>
                </Link>
              ) : (
                <Link className='group relative z-10 w-full sm:w-auto' href='/sign-in'>
                  <div className='absolute -inset-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 opacity-75 transition-all duration-300 group-hover:opacity-100'></div>
                  <Button className='relative w-full overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-6 text-sm font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 sm:py-2.5'>
                    <span className='relative z-10'>Bắt đầu miễn phí</span>
                    <ArrowRight className='relative z-10 ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5' />
                  </Button>
                </Link>
              )}

              <a
                href='https://github.com/auroraphtgrp01/fe-uniko'
                className='group relative w-full sm:w-auto'
                target='_blank'
                rel='noopener noreferrer'
              >
                <div className='absolute -inset-0.5 rounded-full bg-gradient-to-r from-slate-200 to-slate-300 opacity-70 transition-all duration-300 group-hover:opacity-100 dark:from-slate-800 dark:to-slate-700'></div>
                <Button
                  variant='outline'
                  className='relative w-full rounded-full border-slate-200 bg-white px-6 py-6 text-sm font-medium text-slate-700 transition-all duration-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 sm:py-2.5'
                >
                  <Github className='mr-1.5 h-3.5 w-3.5 transition-transform group-hover:rotate-6' />
                  GitHub
                </Button>
              </a>
            </motion.div>
            
            {/* Created By - Moved to bottom */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className='mt-2 text-xs font-medium text-slate-500/70 dark:text-white/50'
            >
              <span className='inline-flex items-center gap-1'>
                <span>Created with</span>
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className='text-rose-400'
                >
                  ❤️
                </motion.span>
                <span>by Le Minh Tuan</span>
              </span>
            </motion.div>
          </motion.div>

          {/* Right column - Updated technical app preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className='relative hidden h-auto w-full md:block'
          >
            <div className='absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-violet-500/30 to-indigo-500/30 opacity-30'></div>
            <div className='relative overflow-hidden rounded-3xl border border-slate-100/60 bg-white shadow-xl dark:border-slate-800/60 dark:bg-slate-900 dark:shadow-slate-900/50'>
              {/* Dashboard Header */}
              <div className='flex items-center justify-between border-b border-slate-100 bg-white px-5 py-3 dark:border-slate-800 dark:bg-slate-900'>
                <div className='flex items-center gap-2'>
                  <div className='flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 p-1'>
                    <Database className='h-3 w-3 text-violet-700 dark:text-violet-300' />
                  </div>
                  <span className='text-xs font-semibold text-slate-700 dark:text-slate-300'>UNIKO</span>
                </div>
                <div className='flex gap-1.5'>
                  <div className='h-3 w-3 rounded-full bg-rose-400'></div>
                  <div className='h-3 w-3 rounded-full bg-amber-400'></div>
                  <div className='h-3 w-3 rounded-full bg-emerald-400'></div>
                </div>
              </div>
              
              {/* Dashboard Content */}
              <div className='p-5'>
                {/* Stats Overview */}
                <div className='grid grid-cols-3 gap-3'>
                  {[
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
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className={`rounded-xl bg-gradient-to-br ${stat.color} p-3 dark:bg-opacity-30`}
                    >
                      <div className='mb-1 flex items-center justify-between'>
                        <span className='text-xs font-medium text-slate-600 dark:text-slate-400'>{stat.label}</span>
                        {stat.icon}
                      </div>
                      <div className='text-lg font-bold text-slate-800 dark:text-white'>{stat.value}</div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Chart Section */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className='mt-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-800 dark:to-slate-900'
                >
                  <div className='mb-3 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <BarChart2 className='h-4 w-4 text-indigo-500' />
                      <span className='text-xs font-semibold text-slate-700 dark:text-slate-300'>Phân tích chi tiêu</span>
                    </div>
                    <div className='flex gap-2'>
                      {['1D', '1W', '1M', '1Y'].map((period, i) => (
                        <span 
                          key={i} 
                          className={`text-xs ${i === 2 ? 'rounded-md bg-indigo-500 px-1.5 py-0.5 font-medium text-white' : 'text-slate-500 dark:text-slate-400'}`}
                        >
                          {period}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Chart visualization */}
                  <div className='h-28'>
                    <div className='flex h-full items-end justify-between gap-1 pb-4 pt-1'>
                      {[40, 25, 35, 45, 35, 55, 45, 60, 75, 70, 65, 80].map((height, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: 1 + i * 0.05, duration: 0.4 }}
                          className={`w-full rounded-t-sm ${i % 3 === 0 ? 'bg-violet-500' : i % 3 === 1 ? 'bg-indigo-500' : 'bg-rose-500'}`}
                        ></motion.div>
                      ))}
                    </div>
                    <div className='flex justify-between'>
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
                        <span key={i} className='text-[8px] text-slate-500 dark:text-slate-400'>
                          {month}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
                
                {/* Transactions */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className='mt-4'
                >
                  <div className='mb-2 flex items-center justify-between'>
                    <span className='text-xs font-semibold text-slate-700 dark:text-slate-300'>Giao dịch gần đây</span>
                    <span className='text-[10px] text-indigo-500'>Xem tất cả</span>
                  </div>
                  
                  {/* Transaction list */}
                  <div className='space-y-2'>
                    {[
                      { name: 'Tiết kiệm định kỳ', amount: '+2,450,000₫', type: 'deposit' },
                      { name: 'Cafe Highland', amount: '-85,000₫', type: 'expense' },
                      { name: 'Lương tháng 8', amount: '+15,000,000₫', type: 'income' }
                    ].map((transaction, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2 + i * 0.1 }}
                        className='flex items-center justify-between rounded-lg bg-white p-2 shadow-sm dark:bg-slate-800'
                      >
                        <div className='flex items-center gap-2'>
                          <div className={`flex h-6 w-6 items-center justify-center rounded-full ${transaction.type === 'expense' ? 'bg-rose-100 dark:bg-rose-900/40' : transaction.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-indigo-100 dark:bg-indigo-900/40'}`}>
                            {transaction.type === 'expense' ? (
                              <ArrowRight className={`h-3 w-3 rotate-45 text-rose-600 dark:text-rose-400`} />
                            ) : transaction.type === 'income' ? (
                              <ArrowRight className={`h-3 w-3 -rotate-135 text-emerald-600 dark:text-emerald-400`} />
                            ) : (
                              <Database className={`h-3 w-3 text-indigo-600 dark:text-indigo-400`} />
                            )}
                          </div>
                          <span className='text-xs font-medium text-slate-700 dark:text-slate-300'>{transaction.name}</span>
                        </div>
                        <span className={`text-xs font-semibold ${transaction.type === 'expense' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          {transaction.amount}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className='absolute bottom-8 left-1/2 -translate-x-1/2 transform'
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className='flex flex-col items-center space-y-2'
          >
            <span className='text-xs text-gray-500 dark:text-gray-400'>Cuộn xuống</span>
            <ChevronDown className='h-4 w-4 text-gray-500 dark:text-gray-400' />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
