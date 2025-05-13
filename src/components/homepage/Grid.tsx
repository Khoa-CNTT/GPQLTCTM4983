'use client'
import { cn } from '@/libraries/utils'
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { BentoGrid, BentoGridItem } from '@/components/homepage/BentoGrid'
import { Table } from 'lucide-react'

export function BentoGridThird() {
  return (
    <div id='features' className='relative'>
      {/* Background Elements - Updated */}
      <div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent pointer-events-none'></div>
      
      <BentoGrid className='relative z-10 mx-auto max-w-7xl px-5 md:auto-rows-[22rem] lg:px-2'>
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            className={cn('[&>p:text-lg]', item.className)}
            icon={item.icon}
            gradient={item.gradient}
          />
        ))}
      </BentoGrid>
    </div>
  )
}

const SkeletonOne = () => {
  const variants = {
    initial: {
      x: 0
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2
      }
    }
  }
  const variantsSecond = {
    initial: {
      x: 0
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2
      }
    }
  }

  return (
    <motion.div
      initial='initial'
      whileHover='animate'
      className='flex h-full w-full flex-col space-y-2 bg-dot-black/[0.2] dark:bg-dot-white/[0.2] rounded-lg overflow-hidden'
    >
      <motion.div
        variants={variants}
        className='flex flex-row items-center space-x-2 rounded-full border border-gray-700/10 bg-white/90 p-2 dark:border-gray-600/10 dark:bg-slate-900/80'
      >
        <div className='h-6 w-6 flex-shrink-0 rounded-full bg-gradient-to-r from-indigo-400/90 to-indigo-500/90' />
        <div className='h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800' />
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className='ml-auto flex w-3/4 flex-row items-center space-x-2 rounded-full border border-gray-700/10 bg-white/90 p-2 dark:border-gray-600/10 dark:bg-slate-900/80'
      >
        <div className='h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800' />
        <div className='h-6 w-6 flex-shrink-0 rounded-full bg-gradient-to-r from-indigo-400/90 to-indigo-500/90' />
      </motion.div>
      <motion.div
        variants={variants}
        className='flex flex-row items-center space-x-2 rounded-full border border-gray-700/10 bg-white/90 p-2 dark:border-gray-600/10 dark:bg-slate-900/80'
      >
        <div className='h-6 w-6 flex-shrink-0 rounded-full bg-gradient-to-r from-indigo-400/90 to-indigo-500/90' />
        <div className='h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800' />
      </motion.div>
    </motion.div>
  )
}

const SkeletonTwo = () => {
  const variants = {
    initial: {
      width: 0
    },
    animate: {
      width: '100%',
      transition: {
        duration: 0.2
      }
    },
    hover: {
      width: ['0%', '100%'],
      transition: {
        duration: 2
      }
    }
  }
  const arr = new Array(6).fill(0)
  return (
    <motion.div
      initial='initial'
      animate='animate'
      whileHover='hover'
      className='flex h-full w-full flex-col space-y-2 bg-dot-black/[0.2] dark:bg-dot-white/[0.2] rounded-lg overflow-hidden'
    >
      {arr.map((_, i) => (
        <motion.div
          key={'skelenton-two' + i}
          variants={variants}
          style={{
            maxWidth: Math.random() * (100 - 40) + 40 + '%'
          }}
          className='flex h-4 w-full flex-row items-center space-x-2 rounded-full border border-gray-700/10 bg-slate-100/90 p-2 dark:border-gray-600/10 dark:bg-slate-800/80'
        ></motion.div>
      ))}
    </motion.div>
  )
}

const SkeletonThree = () => {
  const variants = {
    initial: {
      backgroundPosition: '0 50%'
    },
    animate: {
      backgroundPosition: ['0, 50%', '100% 50%', '0 50%']
    }
  }
  return (
    <motion.div
      initial='initial'
      animate='animate'
      variants={variants}
      transition={{
        duration: 5,
        repeat: Infinity,
        repeatType: 'reverse'
      }}
      className='flex h-full w-full rounded-lg bg-dot-black/[0.2] dark:bg-dot-white/[0.2] overflow-hidden'
      style={{
        background: 'linear-gradient(-45deg, #4f46e5, #6366f1, #818cf8, #a5b4fc)',
        backgroundSize: '400% 400%'
      }}
    >
      <motion.div className='h-full w-full rounded-lg'></motion.div>
    </motion.div>
  )
}

const SkeletonFour = () => {
  const first = {
    initial: {
      x: 20,
      rotate: -5
    },
    hover: {
      x: 0,
      rotate: 0
    }
  }
  const second = {
    initial: {
      x: -20,
      rotate: 5
    },
    hover: {
      x: 0,
      rotate: 0
    }
  }
  return (
    <motion.div
      initial='initial'
      animate='animate'
      whileHover='hover'
      className='flex h-full w-full flex-row space-x-2 bg-dot-black/[0.2] dark:bg-dot-white/[0.2] rounded-lg overflow-hidden'
    >
      <motion.div
        variants={first}
        className='flex h-full w-1/3 flex-col items-center justify-center rounded-2xl border border-gray-700/10 bg-white/90 p-4 dark:border-gray-600/10 dark:bg-slate-900/80'
      >
        <Image
          src={'/avatars/e4d7bc95-b438-4846-b4dd-424fa20ea5b5.png'}
          alt='Chi tiêu không kiểm soát'
          height='100'
          width='100'
          className='h-10 w-10 rounded-full'
        />
        <p className='mt-4 text-center text-xs font-semibold text-slate-600 sm:text-sm dark:text-slate-300'>Chi tiêu không có kế hoạch</p>
        <p className='mt-4 rounded-full border border-indigo-500/20 bg-indigo-50/30 px-2 py-0.5 text-xs text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-900/20 dark:text-indigo-300'>
          Nguy hiểm
        </p>
      </motion.div>
      <motion.div className='relative z-20 flex h-full w-1/3 flex-col items-center justify-center rounded-2xl border border-gray-700/10 bg-white/90 p-4 dark:border-gray-600/10 dark:bg-slate-900/80'>
        <Image
          src={'/avatars/e8d4c0e3-141c-4700-a2f2-55c97103bbf6.png'}
          alt='Lập kế hoạch tài chính'
          height='100'
          width='100'
          className='h-10 w-10 rounded-full'
        />
        <p className='mt-4 text-center text-xs font-semibold text-slate-600 sm:text-sm dark:text-slate-300'>
          Lập kế hoạch chi tiêu hợp lý
        </p>
        <p className='mt-4 rounded-full border border-indigo-500/20 bg-indigo-50/30 px-2 py-0.5 text-xs text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-900/20 dark:text-indigo-300'>
          Khôn ngoan
        </p>
      </motion.div>
      <motion.div
        variants={second}
        className='flex h-full w-1/3 flex-col items-center justify-center rounded-2xl border border-gray-700/10 bg-white/90 p-4 dark:border-gray-600/10 dark:bg-slate-900/80'
      >
        <Image
          src={'/avatars/4a2386d2-8288-46fc-84e3-8f271bd90c9c.png'}
          alt='Tiết kiệm không hiệu quả'
          height='100'
          width='100'
          className='h-10 w-10 rounded-full'
        />
        <p className='mt-4 text-center text-xs font-semibold text-slate-600 sm:text-sm dark:text-slate-300'>
          Để tiền trong ví không sinh lời
        </p>
        <p className='mt-4 rounded-full border border-indigo-500/20 bg-indigo-50/30 px-2 py-0.5 text-xs text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-900/20 dark:text-indigo-300'>
          Lãng phí
        </p>
      </motion.div>
    </motion.div>
  )
}

const SkeletonFive = () => {
  const variants = {
    initial: {
      x: 0
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2
      }
    }
  }
  const variantsSecond = {
    initial: {
      x: 0
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2
      }
    }
  }

  return (
    <motion.div
      initial='initial'
      whileHover='animate'
      className='flex h-full w-full flex-col space-y-2 bg-dot-black/[0.2] dark:bg-dot-white/[0.2] rounded-lg overflow-hidden'
    >
      <motion.div
        variants={variants}
        className='flex flex-row items-start space-x-2 rounded-2xl border border-gray-700/10 bg-white/90 p-2 dark:border-gray-600/10 dark:bg-slate-900/80'
      >
        <Image
          src={'/avatars/e8d4c0e3-141c-4700-a2f2-55c97103bbf6.png'}
          alt='avatar'
          height='100'
          width='100'
          className='h-10 w-10 rounded-full'
        />
        <p className='text-xs text-slate-600 dark:text-slate-300'>
          Tôi muốn tiết kiệm tiền nhưng không biết bắt đầu từ đâu. Mỗi tháng thu nhập ổn định nhưng vẫn thấy tiền cứ
          &quot;bốc hơi&quot; một cách khó hiểu...
        </p>
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className='ml-auto flex w-3/4 flex-row items-center justify-end space-x-2 rounded-full border border-gray-700/10 bg-white/90 p-2 dark:border-gray-600/10 dark:bg-slate-900/80'
      >
        <p className='text-xs text-slate-600 dark:text-slate-300'>Hãy bắt đầu với theo dõi chi tiêu hàng ngày!</p>
        <div className='h-6 w-6 flex-shrink-0 rounded-full bg-gradient-to-r from-indigo-400/90 to-indigo-500/90' />
      </motion.div>
    </motion.div>
  )
}

const items = [
  {
    title: 'Quản Lý Chi Tiêu Thông Minh',
    description: (
      <span className='text-sm'>Giải pháp toàn diện giúp bạn theo dõi và kiểm soát mọi khoản chi tiêu hàng ngày.</span>
    ),
    header: <SkeletonOne />,
    className: 'md:col-span-1',
    icon: <Table className='h-4 w-4 text-indigo-300' />,
    gradient: "from-[#1a1b25]/90 to-[#1f2133]/90 dark:from-[#0d0e17]/90 dark:to-[#141623]/90"
  },
  {
    title: 'Lập Kế Hoạch Tài Chính',
    description: (
      <span className='text-sm'>Xây dựng kế hoạch tài chính cá nhân với các mục tiêu ngắn hạn và dài hạn.</span>
    ),
    header: <SkeletonTwo />,
    className: 'md:col-span-1',
    icon: <Table className='h-4 w-4 text-indigo-300' />,
    gradient: "from-[#1a1b25]/90 to-[#1f2133]/90 dark:from-[#0d0e17]/90 dark:to-[#141623]/90"
  },
  {
    title: 'Phân Tích Chi Tiêu',
    description: (
      <span className='text-sm'>Báo cáo chi tiết và trực quan về các khoản thu chi trong từng giai đoạn.</span>
    ),
    header: <SkeletonThree />,
    className: 'md:col-span-1',
    icon: <Table className='h-4 w-4 text-indigo-300' />,
    gradient: "from-[#1a1b25]/90 to-[#1f2133]/90 dark:from-[#0d0e17]/90 dark:to-[#141623]/90"
  },
  {
    title: 'Hũ Tài Chính Thông Minh',
    description: (
      <span className='text-sm'>Phân bổ thu nhập vào các hũ: thiết yếu, giáo dục, tiết kiệm, đầu tư và hưởng thụ.</span>
    ),
    header: <SkeletonFour />,
    className: 'md:col-span-2',
    icon: <Table className='h-4 w-4 text-indigo-300' />,
    gradient: "from-[#1a1b25]/90 to-[#1f2133]/90 dark:from-[#0d0e17]/90 dark:to-[#141623]/90"
  },
  {
    title: 'Nhắc Nhở Thông Minh',
    description: (
      <span className='text-sm'>Tự động nhắc nhở các khoản chi định kỳ và mục tiêu tài chính cần đạt được.</span>
    ),
    header: <SkeletonFive />,
    className: 'md:col-span-1',
    icon: <Table className='h-4 w-4 text-indigo-300' />,
    gradient: "from-[#1a1b25]/90 to-[#1f2133]/90 dark:from-[#0d0e17]/90 dark:to-[#141623]/90"
  }
]
