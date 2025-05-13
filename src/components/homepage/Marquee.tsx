import { cn } from '@/libraries/utils'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

interface MarqueeProps {
  className?: string
  reverse?: boolean
  pauseOnHover?: boolean
  children?: React.ReactNode
  vertical?: boolean
  repeat?: number
  [key: string]: any
}

export function Marquee({
  className,
  reverse,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 3,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        'group flex overflow-hidden [--duration:40s] [--gap:1.5rem] [gap:var(--gap)]',
        {
          'flex-row': !vertical,
          'flex-col': vertical
        },
        className
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn('flex shrink-0 justify-around [gap:var(--gap)]', {
              'animate-marquee flex-row': !vertical,
              'animate-marquee-vertical flex-col': vertical,
              'group-hover:[animation-play-state:paused]': pauseOnHover,
              '[animation-direction:reverse]': reverse
            })}
          >
            {children}
          </div>
        ))}
    </div>
  )
}

const reviews = [
  {
    name: 'Minh Anh',
    username: '@minhanh',
    body: 'Từ khi sử dụng ứng dụng, tôi đã tiết kiệm được 30% thu nhập mỗi tháng và đạt được mục tiêu mua nhà sau 2 năm',
    img: 'https://avatar.vercel.sh/minhanh',
    rating: 5,
    highlight: true
  },
  {
    name: 'Thanh Hà',
    username: '@thanhha',
    body: 'Giao diện đơn giản, dễ sử dụng nhưng đầy đủ tính năng. Giúp tôi kiểm soát chi tiêu hiệu quả hơn rất nhiều',
    img: 'https://avatar.vercel.sh/thanhha',
    rating: 5
  },
  {
    name: 'Hoàng Nam',
    username: '@hoangnam',
    body: 'Tính năng phân chia hũ tài chính giúp tôi quản lý tiền một cách khoa học. Đã tiết kiệm được một khoản kha khá cho đầu tư',
    img: 'https://avatar.vercel.sh/hoangnam',
    rating: 4
  },
  {
    name: 'Thu Trang',
    username: '@thutrang',
    body: 'Báo cáo chi tiết và trực quan giúp tôi dễ dàng theo dõi các khoản chi tiêu. Rất hữu ích cho việc lập kế hoạch tài chính',
    img: 'https://avatar.vercel.sh/thutrang',
    rating: 5
  },
  {
    name: 'Đức Anh',
    username: '@ducanh',
    body: 'Tính năng nhắc nhở thanh toán định kỳ giúp tôi không bao giờ quên đóng các hóa đơn hàng tháng. Rất tiện lợi!',
    img: 'https://avatar.vercel.sh/ducanh',
    rating: 4,
    highlight: true
  },
  {
    name: 'Mai Linh',
    username: '@mailinh',
    body: 'Ứng dụng giúp tôi xây dựng thói quen tiết kiệm tốt hơn. Giờ đây tôi đã có quỹ dự phòng và cảm thấy an tâm hơn về tài chính',
    img: 'https://avatar.vercel.sh/mailinh',
    rating: 5
  }
]

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)

const ReviewCard = ({ 
  img, 
  name, 
  username, 
  body, 
  rating = 5, 
  highlight = false 
}: { 
  img: string; 
  name: string; 
  username: string; 
  body: string; 
  rating?: number;
  highlight?: boolean;
}) => {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={cn(
        'w-80 md:w-96 overflow-hidden rounded-xl p-0.5',
        highlight ? 
          'bg-gradient-to-r from-violet-500/20 via-rose-500/20 to-violet-500/20 dark:from-violet-500/30 dark:via-rose-500/30 dark:to-violet-500/30' : 
          'bg-transparent'
      )}
    >
      <figure
        className={cn(
          'h-full rounded-[10px] p-6',
          'bg-white shadow-md dark:bg-gray-800/90',
          'border border-gray-100 dark:border-gray-700',
          highlight ?
            'bg-gradient-to-br from-white to-gray-50/90 dark:from-gray-800/95 dark:to-gray-900/95' :
            'bg-white dark:bg-gray-800/90'
        )}
      >
        <div className="flex justify-between items-start mb-4">
          <div className='flex items-center gap-3'>
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-full opacity-30 blur-sm bg-gradient-to-r from-rose-500 to-violet-500"></div>
              <Image className='relative rounded-full border-2 border-white dark:border-gray-800' width={40} height={40} alt={name} src={img} />
            </div>
            <div className='flex flex-col'>
              <figcaption className='font-medium text-gray-900 dark:text-white'>{name}</figcaption>
              <p className='text-xs text-gray-500 dark:text-gray-400'>{username}</p>
            </div>
          </div>
          <div className="flex items-center">
            {Array(5).fill(0).map((_, i) => (
              <Star 
                key={i} 
                size={14} 
                className={cn(
                  "mr-0.5", 
                  i < rating ? 
                    "fill-amber-400 text-amber-400" : 
                    "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                )} 
              />
            ))}
          </div>
        </div>
        
        <div className="relative">
          <Quote size={36} className="absolute -top-1 -left-2 text-gray-200 dark:text-gray-700 opacity-40" />
          <blockquote className='relative mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300'>
            {body}
          </blockquote>
        </div>
      </figure>
    </motion.div>
  )
}

export function MarqueeReview() {
  return (
    <div className='relative py-24 overflow-hidden'>
      {/* Background Elements - Updated */}
      <div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent pointer-events-none'></div>
      
      <div className='relative mx-auto flex w-full flex-col items-center gap-8 overflow-hidden'>
        {/* Gradient fades on sides - Made more transparent to match main gradient */}
        <div className='pointer-events-none absolute left-0 top-0 z-10 h-full w-[10%] bg-gradient-to-r from-transparent to-transparent' />
        <div className='pointer-events-none absolute right-0 top-0 z-10 h-full w-[10%] bg-gradient-to-l from-transparent to-transparent' />
        
        <Marquee pauseOnHover className='mb-8 [--duration:35s]'>
          {firstRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        
        <Marquee reverse pauseOnHover className='[--duration:30s]'>
          {secondRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
      </div>
    </div>
  )
}
