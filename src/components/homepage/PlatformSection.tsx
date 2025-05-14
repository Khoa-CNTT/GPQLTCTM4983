'use client'

import { useState, useMemo, memo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Database, Shield, Zap, Smartphone, LayoutGrid, Activity, PieChart, Wallet, LineChart, BarChart, Lock, Users, CreditCard, Layers } from 'lucide-react'

interface FeatureTabProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  'aria-controls'?: string;
}

// Optimized tab component with memo to prevent unnecessary re-renders
const FeatureTab = memo(({ icon, label, isActive, onClick, ...props }: FeatureTabProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-selected={isActive}
    {...props}
    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
      isActive
        ? 'bg-gradient-to-r from-indigo-50 to-indigo-100/50 text-indigo-600 dark:from-indigo-950/50 dark:to-indigo-900/30 dark:text-indigo-400'
        : 'text-slate-600 hover:bg-gray-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
    }`}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </button>
))

FeatureTab.displayName = 'FeatureTab'

// Define platform features with SEO-relevant content
export const PlatformSection = memo(() => {
  const [activeTab, setActiveTab] = useState(0)

  // Memoize tab data to prevent re-creation on render
  const tabs = useMemo(() => [
    {
      id: 'tracking',
      label: 'Theo dõi chi tiêu',
      icon: <Activity className="h-4 w-4 text-indigo-500" />,
      title: 'Theo dõi chi tiêu thông minh',
      description:
        'UNIKO giúp bạn ghi chép chi tiêu tự động, phân loại giao dịch bằng AI và tạo báo cáo chi tiết. Dễ dàng theo dõi và quản lý mọi khoản chi tiêu hàng ngày với giao diện trực quan, thân thiện.'
    },
    {
      id: 'ai-assistant',
      label: 'Trợ lý thông minh',
      icon: <Sparkles className="h-4 w-4 text-violet-500" />,
      title: 'Trợ lý AI thông minh',
      description:
        'AI phân tích chi tiêu, dự báo xu hướng và đưa ra lời khuyên tài chính cá nhân hóa. Tìm hiểu cách tối ưu ngân sách và đạt mục tiêu tài chính với trợ lý AI của chúng tôi do Lê Minh Tuấn phát triển.'
    },
    {
      id: 'insights',
      label: 'Phân tích chuyên sâu',
      icon: <Database className="h-4 w-4 text-rose-500" />,
      title: 'Phân tích tài chính chuyên sâu',
      description:
        'Báo cáo trực quan về chi tiêu, thu nhập, tiết kiệm và đầu tư. UNIKO cung cấp cái nhìn toàn diện về tình hình tài chính và giúp bạn đưa ra quyết định sáng suốt.'
    },
    {
      id: 'mobile',
      label: 'Đa nền tảng',
      icon: <Smartphone className="h-4 w-4 text-emerald-500" />,
      title: 'Truy cập đa nền tảng',
      description:
        'Sử dụng UNIKO trên mọi thiết bị - máy tính, điện thoại, tablet với đồng bộ hóa dữ liệu theo thời gian thực. Quản lý tài chính mọi lúc, mọi nơi.'
    },
    {
      id: 'security',
      label: 'Bảo mật',
      icon: <Shield className="h-4 w-4 text-amber-500" />,
      title: 'Bảo mật tối đa',
      description:
        'Dữ liệu tài chính của bạn được bảo vệ với mã hóa đa lớp, xác thực hai yếu tố và các tiêu chuẩn bảo mật hàng đầu. Chúng tôi coi trọng việc bảo vệ thông tin tài chính cá nhân của bạn.'
    }
  ], [])

  // Tùy chỉnh màu gradient cho mỗi tab
  const tabGradients = [
    'from-indigo-500 to-blue-500',
    'from-violet-500 to-purple-500',
    'from-rose-500 to-pink-500',
    'from-emerald-500 to-green-500',
    'from-amber-500 to-yellow-500'
  ]

  return (
    <section className="relative" aria-labelledby="platform-section-title">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-3 inline-block rounded-full bg-indigo-50/80 px-3.5 py-1 text-xs font-medium tracking-wide text-indigo-500 dark:bg-indigo-950/30 dark:text-indigo-300"
          >
            Nền tảng quản lý tài chính thông minh
          </motion.span>
          <motion.h2
            id="platform-section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-3 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text text-xl font-bold text-transparent md:text-2xl lg:text-3xl"
          >
            Tất cả trong một nền tảng quản lý
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            UNIKO cung cấp đầy đủ công cụ và tính năng giúp bạn quản lý tài chính cá nhân hiệu quả
          </motion.p>
        </div>

        {/* Feature tabs - optimized with reduced motion and better accessibility */}
        <div className="mt-12 rounded-xl border border-gray-100 bg-white p-1 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {/* Tab navigation */}
          <div className="mb-4 flex flex-wrap gap-2 p-2" role="tablist" aria-label="Tính năng quản lý tài chính UNIKO">
            {tabs.map((tab, index) => (
              <FeatureTab
                key={tab.id}
                icon={tab.icon}
                label={tab.label}
                isActive={activeTab === index}
                onClick={() => setActiveTab(index)}
                aria-controls={`tabpanel-${tab.id}`}
              />
            ))}
          </div>

          {/* Tab content with reduced animations for better performance */}
          <div className="px-6 pb-6">
            <div className="h-[400px]">
              {tabs.map((tab, index) => (
                <div
                  key={tab.id}
                  id={`tabpanel-${tab.id}`}
                  role="tabpanel"
                  aria-labelledby={`tab-${tab.id}`}
                  hidden={activeTab !== index}
                  className={`${activeTab === index ? 'block' : 'hidden'} h-full`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4 }}
                    className="grid gap-8 md:grid-cols-2 h-full"
                  >
                    {/* Feature description */}
                    <div className="flex flex-col justify-center">
                      <h3 className="mb-3 text-lg font-bold text-gray-800 dark:text-white sm:text-xl">
                        {tab.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {tab.description}
                      </p>
                      <ul className="mt-4 space-y-2">
                        {[
                          'Giao diện trực quan dễ sử dụng',
                          'Cá nhân hóa theo nhu cầu của bạn',
                          'Cập nhật liên tục với tính năng mới'
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                              <Zap className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Feature image with optimized loading - REPLACED WITH CREATIVE UI */}
                    <div className="overflow-hidden rounded-lg border border-gray-100 bg-gray-50 shadow-sm dark:border-gray-800 dark:bg-gray-800 h-full flex items-center justify-center">
                      {activeTab === 0 && (
                        <div className="relative aspect-video w-full p-4 flex flex-col items-center justify-center">
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/20"></div>
                          
                          {/* Dashboard UI for expense tracking */}
                          <div className="relative z-10 w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                            {/* Header */}
                            <div className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white flex justify-between items-center">
                              <h4 className="font-medium">Chi tiêu tháng 5</h4>
                              <Wallet className="h-4 w-4" />
                            </div>
                            
                            {/* Chart area */}
                            <div className="p-4">
                              <div className="h-20 flex items-end space-x-2 mb-2">
                                {[40, 60, 35, 80, 55, 75, 50].map((height, i) => (
                                  <div 
                                    key={i} 
                                    className="flex-1 bg-gradient-to-t from-indigo-500 to-blue-400 rounded-t-sm"
                                    style={{ height: `${height}%` }}
                                  ></div>
                                ))}
                              </div>
                              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>T2</span>
                                <span>T3</span>
                                <span>T4</span>
                                <span>T5</span>
                                <span>T6</span>
                                <span>T7</span>
                                <span>CN</span>
                              </div>
                            </div>
                            
                            {/* Transactions */}
                            <div className="px-4 pb-4">
                              <div className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">Giao dịch gần đây</div>
                              {[
                                { name: 'Siêu thị', amount: '320.000đ', icon: <CreditCard className="h-3 w-3" /> },
                                { name: 'Nhà hàng', amount: '150.000đ', icon: <CreditCard className="h-3 w-3" /> },
                                { name: 'Xăng xe', amount: '200.000đ', icon: <CreditCard className="h-3 w-3" /> },
                              ].map((tx, i) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 text-sm">
                                  <div className="flex items-center">
                                    <span className="mr-2 p-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                                      {tx.icon}
                                    </span>
                                    <span className="text-gray-800 dark:text-gray-200">{tx.name}</span>
                                  </div>
                                  <span className="text-gray-600 dark:text-gray-400">{tx.amount}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Animated dots in background */}
                          {[...Array(5)].map((_, i) => (
                            <div 
                              key={i}
                              className="absolute rounded-full bg-indigo-400/20 dark:bg-indigo-600/20"
                              style={{
                                width: `${Math.random() * 40 + 10}px`,
                                height: `${Math.random() * 40 + 10}px`,
                                top: `${Math.random() * 80 + 10}%`,
                                left: `${Math.random() * 80 + 10}%`,
                                animation: `float ${Math.random() * 10 + 5}s ease-in-out ${Math.random() * 2}s infinite alternate`
                              }}
                            ></div>
                          ))}
                        </div>
                      )}
                      
                      {activeTab === 1 && (
                        <div className="relative w-full h-full p-4 flex flex-col items-center justify-center overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/80 to-purple-50/80 dark:from-violet-950/40 dark:to-purple-950/30 backdrop-blur-sm"></div>
                          
                          {/* Decorative elements */}
                          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-b from-fuchsia-300/20 to-transparent rounded-full blur-2xl"></div>
                          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-t from-indigo-300/20 to-transparent rounded-full blur-2xl"></div>
                          
                          {/* Neural network pattern */}
                          <div className="absolute inset-0 opacity-10">
                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                              <path d="M0,30 Q25,10 50,30 T100,30" stroke="url(#neuralGradient)" fill="none" strokeWidth="0.5" />
                              <path d="M0,50 Q25,30 50,50 T100,50" stroke="url(#neuralGradient)" fill="none" strokeWidth="0.5" />
                              <path d="M0,70 Q25,50 50,70 T100,70" stroke="url(#neuralGradient)" fill="none" strokeWidth="0.5" />
                              <defs>
                                <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="rgb(139, 92, 246)" />
                                  <stop offset="100%" stopColor="rgb(216, 180, 254)" />
                                </linearGradient>
                              </defs>
                            </svg>
                          </div>
                          
                          {/* Glass card for AI Assistant UI */}
                          <div className="relative z-10 w-full max-w-md mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl border border-violet-200 dark:border-violet-900/30 shadow-xl overflow-hidden h-[320px]">
                            {/* Assistant header with glass effect */}
                            <div className="bg-gradient-to-r from-violet-500/90 to-purple-600/90 backdrop-blur-sm p-3 flex items-center">
                              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-3 backdrop-blur-sm border border-white/30">
                                <Sparkles className="h-4 w-4 text-white animate-pulse" />
                              </div>
                              <div>
                                <h3 className="text-white font-medium text-sm">AI Finance Assistant</h3>
                                <div className="flex items-center mt-0.5">
                                  <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full mr-1.5 animate-pulse"></span>
                                  <span className="text-xs text-white/80">Online</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Chat container with custom scrollbar */}
                            <div className="p-3 max-h-[260px] overflow-y-auto scrollbar-thin scrollbar-thumb-violet-200 dark:scrollbar-thumb-violet-800 scrollbar-track-transparent">
                              {/* Assistant message with elegant animation */}
                              <div className="flex items-start mb-3 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center mr-2 shadow-md">
                                  <Sparkles className="h-4 w-4 text-white" />
                                </div>
                                <div className="bg-gradient-to-br from-white to-violet-50 dark:from-gray-800 dark:to-gray-800/80 rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm max-w-xs text-sm">
                                  <p className="text-gray-800 dark:text-gray-200">Xin chào! Tôi là trợ lý tài chính AI của bạn. Tôi có thể giúp gì cho bạn hôm nay?</p>
                                  <span className="text-xs text-violet-500 dark:text-violet-400 block mt-1">09:15 AM</span>
                                </div>
                              </div>
                              
                              <div className="flex items-start mb-3 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center mr-2 shadow-md">
                                  <Sparkles className="h-4 w-4 text-white" />
                                </div>
                                <div className="relative bg-gradient-to-br from-white to-violet-50 dark:from-gray-800 dark:to-gray-800/80 rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm max-w-xs text-sm group">
                                  <p className="text-gray-800 dark:text-gray-200">Tôi thấy bạn đã chi tiêu 2.5 triệu vào tuần trước, vượt quá ngân sách 20%. Tôi có thể giúp bạn phân tích khoản chi tiêu này.</p>
                                  <span className="text-xs text-violet-500 dark:text-violet-400 block mt-1">09:16 AM</span>
                                  
                                  {/* Floating data visualization on hover */}
                                  <div className="absolute -right-16 top-0 scale-0 group-hover:scale-100 origin-left transition-transform duration-300 z-10">
                                    <div className="bg-white dark:bg-gray-800 p-1.5 rounded-lg shadow-lg border border-violet-200 dark:border-violet-800/30">
                                      <div className="w-14 h-14">
                                        <svg viewBox="0 0 100 100" className="w-full h-full">
                                          <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                                          <circle cx="50" cy="50" r="40" fill="none" stroke="#8b5cf6" strokeWidth="10" 
                                            strokeDasharray="252" strokeDashoffset="50" transform="rotate(-90 50 50)" />
                                          <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" 
                                            className="text-xs font-medium fill-violet-600 dark:fill-violet-400">+20%</text>
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* User message with subtle effects */}
                              <div className="flex items-start flex-row-reverse mb-3 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-800 border-2 border-indigo-300 dark:border-indigo-700 flex items-center justify-center ml-2 shadow-md">
                                  <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/60 dark:to-indigo-900/30 rounded-2xl rounded-tr-none px-4 py-2.5 shadow-sm max-w-xs text-sm">
                                  <p className="text-gray-800 dark:text-gray-200">Tôi muốn tiết kiệm hơn trong tháng này. Bạn có gợi ý gì không?</p>
                                  <span className="text-xs text-indigo-500 dark:text-indigo-400 block mt-1 text-right">09:17 AM</span>
                                </div>
                              </div>
                              
                              {/* Typing indicator for assistant */}
                              <div className="flex items-start mb-3 animate-fade-in-up" style={{animationDelay: '0.7s'}}>
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center mr-2 shadow-md opacity-70">
                                  <Sparkles className="h-4 w-4 text-white" />
                                </div>
                                <div className="bg-violet-100/50 dark:bg-violet-900/20 rounded-2xl rounded-tl-none px-4 py-3 max-w-[100px]">
                                  <div className="flex space-x-1">
                                    <div className="h-2 w-2 rounded-full bg-violet-400 dark:bg-violet-500 animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                    <div className="h-2 w-2 rounded-full bg-violet-400 dark:bg-violet-500 animate-bounce" style={{animationDelay: '0.3s'}}></div>
                                    <div className="h-2 w-2 rounded-full bg-violet-400 dark:bg-violet-500 animate-bounce" style={{animationDelay: '0.5s'}}></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Message input với thiết kế rõ ràng hơn */}
                            <div className="p-3 border-t border-violet-100 dark:border-violet-900/30">
                              <div className="relative flex items-center w-full bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-full px-4 py-2 border border-violet-200 dark:border-violet-800/30 shadow-sm">
                                <input
                                  type="text"
                                  placeholder="Nhập tin nhắn của bạn..."
                                  className="flex-1 bg-transparent focus:outline-none text-sm text-gray-700 dark:text-gray-300"
                                />
                                <button className="ml-2 p-1.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 shadow-md hover:shadow-lg transform hover:scale-105 transition-transform">
                                  <ArrowRight className="h-4 w-4 text-white" />
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Animated elements */}
                          <div className="absolute top-5 left-10 w-20 h-20 opacity-20 dark:opacity-10 animate-float-slow">
                            <svg viewBox="0 0 200 200" className="w-full h-full">
                              <path fill="none" stroke="#8b5cf6" strokeWidth="1" 
                                d="M40,100 Q50,50 100,50 T160,100 T100,150 T40,100" />
                              <circle cx="40" cy="100" r="3" fill="#8b5cf6" />
                              <circle cx="100" cy="50" r="3" fill="#8b5cf6" />
                              <circle cx="160" cy="100" r="3" fill="#8b5cf6" />
                              <circle cx="100" cy="150" r="3" fill="#8b5cf6" />
                            </svg>
                          </div>
                          
                          <div className="absolute bottom-10 right-20 w-16 h-16 opacity-20 dark:opacity-10 animate-float-slow-reverse">
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                              <polygon points="50,0 100,50 50,100 0,50" fill="none" stroke="#d946ef" strokeWidth="1" />
                              <polygon points="50,20 80,50 50,80 20,50" fill="none" stroke="#d946ef" strokeWidth="1" />
                              <line x1="50" y1="0" x2="50" y2="100" stroke="#d946ef" strokeWidth="0.5" />
                              <line x1="0" y1="50" x2="100" y2="50" stroke="#d946ef" strokeWidth="0.5" />
                            </svg>
                          </div>
                          
                          {/* Dynamic sparkles with better positioning */}
                          {[...Array(12)].map((_, i) => (
                            <div 
                              key={i}
                              className="absolute"
                              style={{
                                top: `${15 + Math.random() * 70}%`,
                                left: `${15 + Math.random() * 70}%`,
                                transform: `rotate(${Math.random() * 360}deg)`,
                                opacity: 0.5 + Math.random() * 0.5,
                                animation: `pulse ${Math.random() * 4 + 2}s ease-in-out ${Math.random() * 2}s infinite alternate`
                              }}
                            >
                              <Sparkles className={`h-${Math.floor(Math.random() * 3) + 2} w-${Math.floor(Math.random() * 3) + 2} text-${Math.random() > 0.5 ? 'violet' : 'purple'}-${Math.floor(Math.random() * 3) * 100 + 300}`} />
                            </div>
                          ))}
                          
                          {/* Add animated circles */}
                          {[...Array(5)].map((_, i) => (
                            <div 
                              key={`circle-${i}`}
                              className="absolute rounded-full"
                              style={{
                                width: `${Math.random() * 60 + 20}px`,
                                height: `${Math.random() * 60 + 20}px`,
                                border: `1px solid rgba(${Math.random() > 0.5 ? '139, 92, 246' : '168, 85, 247'}, ${Math.random() * 0.3 + 0.05})`,
                                top: `${Math.random() * 80 + 10}%`,
                                left: `${Math.random() * 80 + 10}%`,
                                animation: `float ${Math.random() * 15 + 10}s ease-in-out ${Math.random() * 5}s infinite alternate`
                              }}
                            ></div>
                          ))}
                        </div>
                      )}
                      
                      {activeTab === 2 && (
                        <div className="relative w-full h-full p-4 flex flex-col items-center justify-center">
                          <div className="absolute inset-0 bg-gradient-to-br from-teal-50/80 to-emerald-50/80 dark:from-teal-950/40 dark:to-emerald-950/30 backdrop-blur-sm"></div>
                          
                          {/* Decorative elements */}
                          <div className="absolute top-5 left-10 w-24 h-24 bg-gradient-to-br from-teal-200/20 to-emerald-300/10 rounded-full blur-3xl"></div>
                          <div className="absolute bottom-5 right-10 w-32 h-32 bg-gradient-to-tl from-cyan-300/20 to-teal-200/10 rounded-full blur-3xl"></div>
                          
                          {/* Data insights UI - Bold glass morphism effect */}
                          <div className="relative z-10 w-full max-w-md mx-auto grid grid-cols-2 gap-3 h-[320px]">
                            {/* Pie chart card - More vibrant & clear design */}
                            <div className="bg-white/95 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 shadow-md border border-teal-200 dark:border-teal-800/40 col-span-1 transition-all duration-300 hover:shadow-lg">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="text-xs font-semibold text-gray-800 dark:text-white">Phân bổ chi tiêu</h4>
                                <div className="p-1.5 bg-teal-100 dark:bg-teal-800/40 rounded-full">
                                  <PieChart className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-center h-[140px] relative">
                                {/* Pie chart with real data and improved aesthetics */}
                                {(() => {
                                  // Mock data cho Pie chart
                                  const pieData = [
                                    { category: 'Thực phẩm', value: 35, color: 'teal-500', hoverColor: 'teal-400' },
                                    { category: 'Tiện ích', value: 25, color: 'emerald-500', hoverColor: 'emerald-400' },
                                    { category: 'Giải trí', value: 20, color: 'cyan-500', hoverColor: 'cyan-400' },
                                    { category: 'Khác', value: 20, color: 'green-500', hoverColor: 'green-400' }
                                  ];
                                  
                                  let cumulativeAngle = 0;
                                  
                                  return (
                                    <>
                                      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
                                        {/* Shadow effect */}
                                        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                                          <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="rgba(0,0,0,0.25)" />
                                        </filter>
                                        
                                        {/* Outer circle for better aesthetics */}
                                        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(45,212,191,0.2)" strokeWidth="1" className="dark:stroke-teal-700/30" />
                                        
                                        {/* Background circle */}
                                        <circle cx="50" cy="50" r="40" fill="white" className="dark:fill-gray-800" />
                                        
                                        {pieData.map((segment, index) => {
                                          // Tính góc bắt đầu và kết thúc cho từng phần
                                          const startAngle = cumulativeAngle;
                                          const angle = (segment.value / 100) * 360;
                                          cumulativeAngle += angle;
                                          const endAngle = cumulativeAngle;
                                          
                                          // Chuyển đổi góc sang tọa độ
                                          const startX = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
                                          const startY = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
                                          const endX = 50 + 40 * Math.cos((endAngle - 90) * Math.PI / 180);
                                          const endY = 50 + 40 * Math.sin((endAngle - 90) * Math.PI / 180);
                                          
                                          // Tạo path cho từng phần
                                          const largeArcFlag = angle > 180 ? 1 : 0;
                                          const pathData = [
                                            `M 50 50`,
                                            `L ${startX} ${startY}`,
                                            `A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                                            `Z`
                                          ].join(' ');
                                          
                                          return (
                                            <g key={index} className="cursor-pointer">
                                              <path
                                                d={pathData}
                                                className={`fill-${segment.color} hover:fill-${segment.hoverColor} transition-colors duration-300`}
                                                filter="url(#shadow)"
                                              >
                                                <title>{segment.category}: {segment.value}%</title>
                                              </path>
                                            </g>
                                          );
                                        })}
                                        
                                        {/* Inner circle with gradient effect */}
                                        <circle cx="50" cy="50" r="25" className="fill-white/95 dark:fill-gray-800/95 stroke-gray-100 dark:stroke-gray-700" strokeWidth="0.5" />
                                      </svg>
                                      
                                      {/* Center text with improved styling */}
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full p-2.5 shadow-inner">
                                          <span className="block text-[10px] font-medium text-gray-500 dark:text-gray-400">Tổng</span>
                                          <span className="block text-base font-bold bg-gradient-to-br from-teal-500 to-emerald-500 bg-clip-text text-transparent">2.6tr</span>
                                        </div>
                                      </div>
                                    </>
                                  );
                                })()}
                              </div>
                              
                              <div className="grid grid-cols-2 gap-y-2 gap-x-2 mt-2 px-1 text-[10px]">
                                {[
                                  { label: 'Thực phẩm', color: 'bg-teal-500', percent: '35%' },
                                  { label: 'Tiện ích', color: 'bg-emerald-500', percent: '25%' },
                                  { label: 'Giải trí', color: 'bg-cyan-500', percent: '20%' },
                                  { label: 'Khác', color: 'bg-green-500', percent: '20%' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center">
                                      <div className={`h-2.5 w-2.5 ${item.color} rounded-full mr-1.5 group-hover:scale-125 transition-transform`}></div>
                                      <span className="text-gray-700 dark:text-gray-300 group-hover:font-medium transition-all">{item.label}</span>
                                    </div>
                                    <span className="text-gray-600 dark:text-gray-400 font-medium">{item.percent}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {/* Line chart card - More vibrant & clear design */}
                            <div className="bg-white/95 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 shadow-md border border-teal-200 dark:border-teal-800/40 col-span-1 transition-all duration-300 hover:shadow-lg">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="text-xs font-semibold text-gray-800 dark:text-white">Chi tiêu theo tuần</h4>
                                <div className="p-1.5 bg-teal-100 dark:bg-teal-800/40 rounded-full">
                                  <LineChart className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                                </div>
                              </div>
                              
                              <div className="h-[140px] flex flex-col justify-end">
                                {(() => {
                                  // Mock data cho Line chart
                                  const lineData = [
                                    { week: 'T1', amount: 400000 },
                                    { week: 'T2', amount: 320000 },
                                    { week: 'T3', amount: 580000 },
                                    { week: 'T4', amount: 450000 }
                                  ];
                                  
                                  // Tìm giá trị lớn nhất để scale dữ liệu
                                  const maxAmount = Math.max(...lineData.map(d => d.amount));
                                  
                                  // Tạo path cho line chart
                                  const getCoordinates = (index: number, value: number) => {
                                    const x = (index / (lineData.length - 1)) * 100;
                                    const y = 60 - (value / maxAmount) * 50; // Scale to fit in 50px height
                                    return { x, y };
                                  };
                                  
                                  // Tạo points cho path
                                  const points = lineData.map((d, i) => getCoordinates(i, d.amount));
                                  const pathD = points.map((point, i) => 
                                    `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
                                  ).join(' ');
                                  
                                  // Tạo path cho gradient area
                                  const areaPathD = `${pathD} L ${points[points.length-1].x} 60 L 0 60 Z`;
                                  
                                  return (
                                    <svg className="w-full h-full" viewBox="0 0 100 60">
                                      <defs>
                                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                          <stop offset="0%" stopColor="rgb(20, 184, 166)" stopOpacity="0.3" />
                                          <stop offset="100%" stopColor="rgb(20, 184, 166)" stopOpacity="0" />
                                        </linearGradient>
                                        
                                        {/* Add subtle glow effect */}
                                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                          <feGaussianBlur stdDeviation="1.5" result="blur" />
                                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                        </filter>
                                      </defs>
                                      
                                      {/* Improved grid lines */}
                                      {[0, 1, 2, 3].map(i => (
                                        <line 
                                          key={`grid-${i}`}
                                          x1="0" 
                                          y1={15 + i * 15} 
                                          x2="100" 
                                          y2={15 + i * 15} 
                                          stroke="rgba(229, 231, 235, 0.5)" 
                                          strokeWidth="0.5"
                                          strokeDasharray="1,1.5"
                                          className="dark:stroke-gray-700/40"
                                        />
                                      ))}
                                      
                                      {/* Gradient area below line */}
                                      <path 
                                        d={areaPathD}
                                        fill="url(#lineGradient)"
                                        className="transition-opacity duration-300"
                                      />
                                      
                                      {/* Expense line with subtle shadow */}
                                      <path 
                                        d={pathD}
                                        fill="none" 
                                        stroke="rgb(20, 184, 166)" 
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        filter="url(#glow)"
                                        className="drop-shadow"
                                      />
                                      
                                      {/* Data points with improved visuals */}
                                      {points.map((point, i) => (
                                        <g key={`point-${i}`} className="cursor-pointer">
                                          {/* Larger hover target */}
                                          <circle 
                                            cx={point.x} 
                                            cy={point.y} 
                                            r="4" 
                                            fill="transparent"
                                            className="hover:fill-teal-50 dark:hover:fill-teal-900/30 transition-all duration-300"
                                          />
                                          
                                          {/* Actual point */}
                                          <circle 
                                            cx={point.x} 
                                            cy={point.y} 
                                            r="2.5" 
                                            fill="white" 
                                            stroke="rgb(20, 184, 166)" 
                                            strokeWidth="1.5"
                                            className="dark:fill-gray-800 transition-all duration-300 hover:scale-125"
                                          />
                                          
                                          {/* Amount indicator with better styling */}
                                          <g className="opacity-0 hover:opacity-100 transition-opacity duration-300">
                                            <rect 
                                              x={point.x - 10} 
                                              y={point.y - 15} 
                                              width="20" 
                                              height="10" 
                                              rx="2"
                                              fill="white" 
                                              className="dark:fill-gray-700"
                                              stroke="rgba(20, 184, 166, 0.3)"
                                              strokeWidth="0.5"
                                            />
                                            <text 
                                              x={point.x} 
                                              y={point.y - 8} 
                                              textAnchor="middle" 
                                              dominantBaseline="middle"
                                              className="text-[6px] font-medium fill-teal-600 dark:fill-teal-400"
                                            >
                                              {(lineData[i].amount/1000).toFixed(0)}k
                                            </text>
                                          </g>
                                        </g>
                                      ))}
                                    </svg>
                                  );
                                })()}
                              </div>
                              
                              <div className="flex justify-between text-[10px] text-gray-600 dark:text-gray-400 mt-2 px-2">
                                {['T1', 'T2', 'T3', 'T4'].map((week, i) => (
                                  <div key={i} className="flex flex-col items-center">
                                    <span className="font-medium">{week}</span>
                                    <div className="h-1 w-1 rounded-full bg-teal-400 dark:bg-teal-600 mt-1"></div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {/* Bar chart card - More vibrant & clear design */}
                          
                          </div>
                        </div>
                      )}
                      
                      {activeTab === 3 && (
                        <div className="relative w-full h-full p-4 flex flex-col items-center justify-center">
                          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/20"></div>
                          
                          {/* Multi-platform UI */}
                          <div className="relative z-10 w-full max-w-md mx-auto flex items-center justify-center gap-6 h-[320px]">
                            {/* Desktop view */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 w-64 h-44">
                              <div className="h-4 bg-gray-100 dark:bg-gray-700 mb-2 rounded flex items-center px-1">
                                <div className="flex space-x-1">
                                  <div className="h-2 w-2 rounded-full bg-red-400"></div>
                                  <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                                  <div className="h-2 w-2 rounded-full bg-green-400"></div>
                                </div>
                              </div>
                              <div className="flex flex-col h-36 space-y-1.5">
                                <div className="h-5 bg-emerald-100 dark:bg-emerald-900/20 rounded w-full"></div>
                                <div className="flex space-x-1 flex-1">
                                  <div className="w-1/3 bg-emerald-100 dark:bg-emerald-900/20 rounded"></div>
                                  <div className="w-2/3 bg-emerald-100 dark:bg-emerald-900/20 rounded"></div>
                                </div>
                                <div className="h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded"></div>
                              </div>
                            </div>
                            
                            {/* Mobile view */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-1.5 w-24 h-44 border border-gray-200 dark:border-gray-700">
                              <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full w-10 mx-auto mb-1.5"></div>
                              <div className="flex flex-col h-38 space-y-1.5">
                                <div className="h-4 bg-emerald-100 dark:bg-emerald-900/20 rounded w-full"></div>
                                <div className="grid grid-cols-2 gap-1 flex-1">
                                  <div className="bg-emerald-100 dark:bg-emerald-900/20 rounded"></div>
                                  <div className="bg-emerald-100 dark:bg-emerald-900/20 rounded"></div>
                                  <div className="bg-emerald-100 dark:bg-emerald-900/20 rounded"></div>
                                  <div className="bg-emerald-100 dark:bg-emerald-900/20 rounded"></div>
                                </div>
                                <div className="h-14 bg-emerald-100 dark:bg-emerald-900/20 rounded"></div>
                              </div>
                              <div className="h-3 mt-1 bg-gray-100 dark:bg-gray-700 rounded-full w-8 mx-auto"></div>
                            </div>
                            
                            {/* Tablet view */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2 w-36 h-48 border border-gray-200 dark:border-gray-700">
                              <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full w-14 mx-auto mb-1.5"></div>
                              <div className="flex flex-col h-42 space-y-1.5">
                                <div className="h-5 bg-emerald-100 dark:bg-emerald-900/20 rounded w-full"></div>
                                <div className="grid grid-cols-2 gap-1 flex-1">
                                  <div className="bg-emerald-100 dark:bg-emerald-900/20 rounded"></div>
                                  <div className="bg-emerald-100 dark:bg-emerald-900/20 rounded"></div>
                                  <div className="bg-emerald-100 dark:bg-emerald-900/20 rounded"></div>
                                  <div className="bg-emerald-100 dark:bg-emerald-900/20 rounded"></div>
                                </div>
                                <div className="h-20 bg-emerald-100 dark:bg-emerald-900/20 rounded"></div>
                              </div>
                              <div className="h-3 mt-1 bg-gray-100 dark:bg-gray-700 rounded-full w-10 mx-auto"></div>
                            </div>
                          </div>
                          
                          {/* Connection lines between devices */}
                          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 5 }}>
                            <line x1="30%" y1="50%" x2="48%" y2="50%" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1" strokeDasharray="5,3" />
                            <line x1="52%" y1="50%" x2="70%" y2="50%" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1" strokeDasharray="5,3" />
                            <circle cx="50%" cy="50%" r="15" fill="rgba(16, 185, 129, 0.1)" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1" />
                            <path d="M45,50 L55,50 M50,45 L50,55" stroke="rgba(16, 185, 129, 0.8)" strokeWidth="1.5" />
                          </svg>
                        </div>
                      )}
                      
                      {activeTab === 4 && (
                        <div className="relative w-full h-full p-4 flex flex-col items-center justify-center">
                          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/20"></div>
                          
                          {/* Security UI */}
                          <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center justify-center h-[320px]">
                            {/* Lock animation */}
                            <div className="relative mb-6">
                              <div className="absolute inset-0 rounded-full bg-amber-200 dark:bg-amber-900/30 animate-pulse"></div>
                              <div className="relative p-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500">
                                <Lock className="h-10 w-10 text-white" />
                              </div>
                              
                              {/* Shield rings */}
                              <div className="absolute -inset-4 border-2 border-amber-300 dark:border-amber-700 rounded-full border-dashed animate-[spin_10s_linear_infinite]"></div>
                              <div className="absolute -inset-8 border border-amber-200 dark:border-amber-800 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                              <div className="absolute -inset-12 border border-amber-100 dark:border-amber-900/50 rounded-full border-dotted animate-[spin_20s_linear_infinite]"></div>
                            </div>
                            
                            {/* Security features */}
                            <div className="w-full grid grid-cols-2 gap-4">
                              {[
                                { title: 'Mã hóa đa lớp', icon: <Layers className="h-5 w-5 text-amber-500" /> },
                                { title: 'Xác thực 2 yếu tố', icon: <Shield className="h-5 w-5 text-amber-500" /> },
                              ].map((feature, i) => (
                                <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center text-center">
                                  <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-3">
                                    {feature.icon}
                                  </div>
                                  <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                    {feature.title}
                                  </h5>
                                </div>
                              ))}
                            </div>
                            
                            {/* Security badge */}
                            <div className="mt-8 px-5 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full text-white text-xs font-medium flex items-center">
                              <Shield className="h-3 w-3 mr-1.5" />
                              <span>Bảo mật chuẩn ngân hàng</span>
                            </div>
                          </div>
                          
                          {/* Animated particles */}
                          {[...Array(8)].map((_, i) => (
                            <div 
                              key={i}
                              className="absolute bg-amber-300 dark:bg-amber-600 rounded-full opacity-30"
                              style={{
                                width: `${Math.random() * 4 + 2}px`,
                                height: `${Math.random() * 4 + 2}px`,
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animation: `float ${Math.random() * 8 + 4}s ease-in-out ${Math.random() * 2}s infinite alternate`
                              }}
                            ></div>
                          ))}
                        </div>
                      )}
                      
                      {/* Add CSS animations for the background elements */}
                      <style jsx>{`
                        @keyframes float {
                          0% { transform: translateY(0) rotate(0deg); }
                          100% { transform: translateY(-20px) rotate(360deg); }
                        }
                        
                        @keyframes float-slow {
                          0% { transform: translateY(0) rotate(0deg); }
                          50% { transform: translateY(-10px) rotate(180deg); }
                          100% { transform: translateY(0) rotate(360deg); }
                        }
                        
                        @keyframes float-slow-reverse {
                          0% { transform: translateY(0) rotate(0deg); }
                          50% { transform: translateY(10px) rotate(-180deg); }
                          100% { transform: translateY(0) rotate(-360deg); }
                        }
                        
                        @keyframes pulse {
                          0% { transform: scale(0.8); opacity: 0.3; }
                          100% { transform: scale(1.2); opacity: 0.7; }
                        }
                        
                        @keyframes fade-in-up {
                          0% { opacity: 0; transform: translateY(10px); }
                          100% { opacity: 1; transform: translateY(0); }
                        }
                        
                        .animate-fade-in-up {
                          animation: fade-in-up 0.5s ease-out forwards;
                        }
                        
                        /* Customize scrollbar */
                        .scrollbar-thin::-webkit-scrollbar {
                          width: 4px;
                        }
                        
                        .scrollbar-thumb-violet-200::-webkit-scrollbar-thumb {
                          background-color: #ddd6fe;
                          border-radius: 2px;
                        }
                        
                        .dark .scrollbar-thumb-violet-800::-webkit-scrollbar-thumb {
                          background-color: #5b21b6;
                        }
                        
                        .scrollbar-track-transparent::-webkit-scrollbar-track {
                          background-color: transparent;
                        }
                      `}</style>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

PlatformSection.displayName = 'PlatformSection'
