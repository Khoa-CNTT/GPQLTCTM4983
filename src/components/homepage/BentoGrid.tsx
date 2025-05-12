import { cn } from '@/libraries/utils'
import { motion } from 'framer-motion'

export const BentoGrid = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return (
    <div className={cn('mx-auto grid max-w-7xl grid-cols-1 md:auto-rows-[16rem] md:grid-cols-3 gap-4 md:gap-5', className)}>
      {children}
    </div>
  )
}

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  gradient = 'from-[#1a1b25]/90 to-[#1f2133]/90 dark:from-[#0d0e17]/90 dark:to-[#141623]/90'
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  gradient?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={cn(
        'group/bento row-span-1 flex flex-col justify-between rounded-xl border border-gray-700/10 dark:border-gray-500/10 overflow-hidden backdrop-blur-md transition duration-300 hover:border-indigo-500/10 hover:shadow-lg dark:hover:border-indigo-500/10 dark:hover:shadow-indigo-500/5',
        className
      )}
    >
      {/* Glass morphism background with subtle gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} -z-10`} />
      
      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('/grid-pattern.svg')] bg-[length:20px_20px] -z-5"></div>
      
      {/* Content container */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header section with visual content */}
        <div className="flex-1 p-4 pb-0">
          {header}
        </div>
        
        {/* Text content section */}
        <div className="p-4 pt-2">
          <div className="transition duration-300 group-hover/bento:translate-x-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#1e213a]/90 to-[#171929]/90 shadow-md border border-white/5 transition-all duration-300 group-hover/bento:shadow-lg">
                {icon}
              </div>
              <div className="font-sans text-base font-medium text-white/90">{title}</div>
            </div>
            <div className="font-sans text-sm leading-relaxed text-white/70">{description}</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export const BentoGridThird = () => {
  return (
    <div className="relative">
      {/* Background Elements - Updated */}
      <div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent pointer-events-none'></div>
      
      <BentoGrid className="max-w-5xl mx-auto relative z-10">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            icon={item.icon}
            className={i === 0 ? "md:col-span-2" : ""}
            gradient={item.gradient}
          />
        ))}
      </BentoGrid>
    </div>
  );
};

const items = [
  {
    title: "Tổng quan tài chính",
    description:
      "Xem tổng quan toàn diện về tài sản, thu nhập, chi tiêu và tiết kiệm của bạn trong một giao diện trực quan.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-300">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
    gradient: "from-[#1a1b25]/90 to-[#1f2133]/90 dark:from-[#0d0e17]/90 dark:to-[#141623]/90",
  },
  {
    title: "Quản lý chi tiêu",
    description:
      "Theo dõi và phân loại chi tiêu của bạn tự động, nhận cảnh báo khi vượt ngân sách.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-300">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
      </svg>
    ),
    gradient: "from-[#1a1b25]/90 to-[#1f2133]/90 dark:from-[#0d0e17]/90 dark:to-[#141623]/90",
  },
  {
    title: "Lập kế hoạch tài chính",
    description:
      "Thiết lập mục tiêu tài chính và theo dõi tiến độ của bạn với các công cụ trực quan.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-300">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
      </svg>
    ),
    gradient: "from-[#1a1b25]/90 to-[#1f2133]/90 dark:from-[#0d0e17]/90 dark:to-[#141623]/90",
  },
  {
    title: "Phân tích dữ liệu",
    description:
      "Hiểu rõ hơn về thói quen tài chính của bạn với các biểu đồ phân tích và báo cáo chi tiết.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-300">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
      </svg>
    ),
    gradient: "from-[#1a1b25]/90 to-[#1f2133]/90 dark:from-[#0d0e17]/90 dark:to-[#141623]/90",
  },
  {
    title: "Đồng bộ hóa đa thiết bị",
    description:
      "Truy cập dữ liệu tài chính của bạn từ mọi thiết bị, đồng bộ hóa thời gian thực và an toàn.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-300">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
      </svg>
    ),
    gradient: "from-[#1a1b25]/90 to-[#1f2133]/90 dark:from-[#0d0e17]/90 dark:to-[#141623]/90",
  },
  {
    title: "Bảo mật tài chính",
    description:
      "Bảo vệ dữ liệu tài chính của bạn với xác thực hai yếu tố và mã hóa đầu cuối.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-300">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    gradient: "from-[#1a1b25]/90 to-[#1f2133]/90 dark:from-[#0d0e17]/90 dark:to-[#141623]/90",
  },
];
