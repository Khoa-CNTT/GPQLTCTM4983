'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, BarChart3, PiggyBank, Clock, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Screen1 from '@/images/screens/screen1.jpg'
import Screen2 from '@/images/screens/screen2.jpg'
import Screen3 from '@/images/screens/screen3.jpg'
import Screen4 from '@/images/screens/screen4.jpg'
import Iphone15Pro from './IphoneScreen'

export const IPhoneDemo = () => {
    const [activeScreen, setActiveScreen] = useState(0)
    const [autoplay, setAutoplay] = useState(true)
    const [animationComplete, setAnimationComplete] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const screens = [
        Screen1,
        Screen2,
        Screen3,
        Screen4,
    ]

    const features = [
        {
            title: "Biểu đồ phân tích chi tiết",
            description: "Trực quan hóa dữ liệu tài chính của bạn với đồ thị tương tác và biểu đồ sống động",
            icon: <BarChart3 className="w-3.5 h-3.5" />
        },
        {
            title: "Phân loại giao dịch tự động",
            description: "Trí tuệ nhân tạo thông minh tự động phân loại và gắn nhãn các giao dịch của bạn",
            icon: <Zap className="w-3.5 h-3.5" />
        },
        {
            title: "Lập kế hoạch ngân sách",
            description: "Tạo và theo dõi ngân sách hàng tháng, phân bổ chi tiêu hợp lý đến từng hạng mục",
            icon: <PiggyBank className="w-3.5 h-3.5" />
        },
        {
            title: "Báo cáo tài chính theo thời gian thực",
            description: "Nhận thông báo và báo cáo tức thì về tình hình tài chính của bạn mọi lúc mọi nơi",
            icon: <Clock className="w-3.5 h-3.5" />
        }
    ]

    const testimonials = [
        {
            quote: "Ứng dụng đã thay đổi hoàn toàn cách tôi quản lý tài chính cá nhân!",
            author: "Nguyễn Minh Tuấn",
            role: "Chuyên viên Marketing"
        },
        {
            quote: "Giao diện trực quan, dễ sử dụng và giúp tôi tiết kiệm được 30% chi tiêu hàng tháng.",
            author: "Trần Thị Mai",
            role: "Kế toán viên"
        },
        {
            quote: "Chưa bao giờ việc theo dõi chi tiêu lại dễ dàng đến thế!",
            author: "Lê Văn Hoàng",
            role: "Sinh viên"
        }
    ]

    // Autoplay functionality
    useEffect(() => {
        if (!autoplay) return

        const interval = setInterval(() => {
            setActiveScreen((prev) => (prev + 1) % screens.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [autoplay, screens.length])

    // Animation completion
    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimationComplete(true)
        }, 2000)
        
        return () => clearTimeout(timer)
    }, [])

    // Intersection observer for parallax effects
    useEffect(() => {
        if (!containerRef.current) return
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view')
                    }
                })
            },
            { threshold: 0.1 }
        )
        
        const elements = containerRef.current.querySelectorAll('.parallax-element')
        elements.forEach(el => observer.observe(el))
        
        return () => {
            elements.forEach(el => observer.unobserve(el))
        }
    }, [])

    // Pause autoplay when user interacts
    const handleScreenChange = (index: number) => {
        setActiveScreen(index)
        setAutoplay(false)
        // Resume autoplay after 15 seconds of inactivity
        setTimeout(() => setAutoplay(true), 15000)
    }

    const handlePrevious = () => {
        setActiveScreen((prev) => (prev - 1 + screens.length) % screens.length)
        setAutoplay(false)
        setTimeout(() => setAutoplay(true), 15000)
    }

    const handleNext = () => {
        setActiveScreen((prev) => (prev + 1) % screens.length)
        setAutoplay(false)
        setTimeout(() => setAutoplay(true), 15000)
    }

    return (
        <div className="relative overflow-hidden py-16" ref={containerRef}>
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/3 w-72 h-72 bg-teal-400/10 rounded-full filter blur-3xl opacity-30 parallax-element" 
                    style={{transform: 'translateY(20px)'}}></div>
                <div className="absolute bottom-32 right-1/3 w-48 h-48 bg-cyan-500/10 rounded-full filter blur-3xl opacity-40 parallax-element"
                    style={{transform: 'translateY(-15px)'}}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-sky-50/5 to-transparent opacity-50"></div>
                
                {/* Animated particles - reduced quantity */}
                <div className="particle-container">
                    {[...Array(12)].map((_, index) => (
                        <motion.div
                            key={index}
                            className="absolute rounded-full bg-gradient-to-r from-teal-400 to-cyan-400"
                            style={{
                                width: Math.random() * 4 + 2 + 'px',
                                height: Math.random() * 4 + 2 + 'px',
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                opacity: Math.random() * 0.4 + 0.1,
                            }}
                            animate={{
                                y: [0, -20, 0],
                                opacity: [0.1, 0.25, 0.1],
                            }}
                            transition={{
                                duration: Math.random() * 5 + 8,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut",
                                delay: Math.random() * 5,
                            }}
                        />
                    ))}
                </div>
            </div>
            
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
                id="demo"
            >
                <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
                    {/* Section header - more compact */}
                    <motion.div 
                        className="text-center max-w-2xl mx-auto mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div 
                            className="inline-flex items-center gap-1.5 mb-2 px-3 py-1 bg-gradient-to-r from-teal-50/80 to-cyan-50/80 dark:from-teal-900/30 dark:to-cyan-900/30 border border-teal-100/80 dark:border-teal-800/30 rounded-full"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            <Sparkles className="w-3 h-3 text-teal-500" />
                            <span className="text-xs font-medium text-teal-700 dark:text-teal-300">Đổi mới trải nghiệm tài chính</span>
                        </motion.div>
                        
                        <h2 className="text-2xl md:text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500">
                            Tương lai của quản lý tài chính cá nhân
                        </h2>
                        
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                            Khám phá cách công nghệ thay đổi việc quản lý tài chính cá nhân với giao diện trực quan, thông minh và dễ sử dụng.
                        </p>
                    </motion.div>

                    {/* Main content - rebalanced grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        {/* Left side - App Features */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-4 md:col-span-5"
                        >
                            <div className="space-y-3">
                                {features.map((feature, index) => (
                                    <motion.div 
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="group"
                                    >
                                        <div className="flex gap-3 items-start p-3 rounded-xl transition-all duration-300 
                                                        hover:bg-white/50 dark:hover:bg-gray-800/50 hover:shadow-sm hover:shadow-teal-100/50 dark:hover:shadow-cyan-900/20
                                                        border border-transparent hover:border-teal-100/60 dark:hover:border-cyan-800/30">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400/90 to-cyan-400/90 flex items-center justify-center shadow-md shadow-teal-400/20 group-hover:shadow-lg group-hover:shadow-teal-400/30 transition-all duration-300">
                                                <div className="text-white">
                                                    {feature.icon}
                                                </div>
                                            </div>
                                            <div className="space-y-0.5">
                                                <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300">
                                                    {feature.title}
                                                </h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                className="mt-5"
                            >
                                <Link href="/sign-in" className="inline-flex">
                                    <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-full px-5 py-2 text-xs shadow-lg shadow-teal-400/20 hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-300">
                                        Dùng thử miễn phí
                                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                                    </Button>
                                </Link>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    Không cần thẻ tín dụng. Bắt đầu trải nghiệm ngay.
                                </p>
                            </motion.div>
                        </motion.div>
                        
                        {/* Center - Phone Demo - smaller */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="flex justify-center md:col-span-3"
                        >
                            <div className="relative w-full max-w-[220px] mx-auto">
                                {/* Phone shadow and glow effect - smaller */}
                                <div className="absolute -inset-3 bg-gradient-to-b from-teal-400/10 via-cyan-300/5 to-sky-400/10 rounded-[60px] filter blur-xl opacity-60 -z-10 animate-pulse"></div>
                                
                                {/* iPhone mockup with floating effect - reduced floating */}
                                <motion.div
                                    className="relative"
                                    animate={{
                                        y: [0, -6, 0],
                                    }}
                                    transition={{ 
                                        duration: 5,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        ease: "easeInOut"
                                    }}
                                >
                                    {/* Custom phone frame with glow */}
                                    <div className="absolute -inset-1 bg-gradient-to-tr from-teal-500/15 via-cyan-400/10 to-sky-500/15 rounded-[50px] blur-md opacity-70 -z-10 
                                                    animate-glow"></div>
                                    
                                    <div className="relative">
                                        {/* iPhone device - reduced size */}
                                        <Iphone15Pro
                                            width={220}
                                            className="w-full h-auto"
                                        />
                                        
                                        {/* Screen content */}
                                        <div className="absolute top-[2.2%] left-[4.75%] right-[4.75%] bottom-[2.2%] rounded-[30px] overflow-hidden bg-gray-50 dark:bg-gray-900">
                                            {/* Screen glass effect */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none z-[1]"></div>
                                            
                                            <motion.div
                                                className="h-full w-full"
                                                animate={{ 
                                                    x: `-${activeScreen * 100}%`,
                                                }}
                                                transition={{ 
                                                    type: "spring", 
                                                    stiffness: 300, 
                                                    damping: 30 
                                                }}
                                            >
                                                <div className="flex h-full">
                                                    {screens.map((screen, index) => (
                                                        <motion.div 
                                                            key={index} 
                                                            className="min-w-full h-full flex-shrink-0 flex items-center justify-center"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ 
                                                                opacity: activeScreen === index ? 1 : 0.5,
                                                                scale: activeScreen === index ? 1 : 0.98,
                                                            }}
                                                            transition={{ duration: 0.5 }}
                                                        >
                                                            <div className="relative w-full h-full">
                                                                <Image
                                                                    src={screen}
                                                                    alt={`Màn hình demo ${index + 1}`}
                                                                    priority={index === activeScreen}
                                                                    fill
                                                                    sizes="100%"
                                                                    style={{
                                                                        objectFit: 'cover',
                                                                        objectPosition: 'center',
                                                                    }}
                                                                    className="transition-all duration-500"
                                                                />
                                                                
                                                                {/* Screen overlay with highlights for active screen */}
                                                                {activeScreen === index && (
                                                                    <motion.div 
                                                                        className="absolute inset-0 bg-gradient-to-t from-teal-500/10 to-transparent opacity-0"
                                                                        animate={{ opacity: [0, 0.3, 0] }}
                                                                        transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
                                                                    />
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                            
                                            {/* Screen overlay effects */}
                                            <div className="absolute inset-0 pointer-events-none">
                                                {/* Subtle screen reflection */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-40"></div>
                                                
                                                {/* Subtle scanlines effect */}
                                                <div className="absolute inset-0 bg-scanlines opacity-[0.03]"></div>
                                                
                                                {/* Screen edge glow */}
                                                <div className="absolute inset-0 rounded-[30px] shadow-inner"></div>
                                            </div>
                                        </div>
                                        
                                        {/* Screen information overlay - smaller */}
                                        <motion.div 
                                            className="absolute top-2 right-2 text-[10px] font-medium bg-black/40 backdrop-blur-md text-white rounded-full px-2 py-0.5 shadow-lg"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.5, duration: 0.3 }}
                                        >
                                            {activeScreen + 1}/{screens.length}
                                        </motion.div>
                                    </div>
                                </motion.div>

                                {/* Navigation buttons - smaller and compact */}
                                <div className="flex justify-center space-x-3 mt-4">
                                    <motion.button
                                        className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 backdrop-blur-sm flex items-center justify-center 
                                                   shadow-md shadow-teal-400/20 hover:shadow-lg hover:shadow-teal-500/30 hover:from-teal-500 hover:to-cyan-600 transition-all text-white"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handlePrevious}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </motion.button>
                                    
                                    <div className="flex items-center space-x-1.5">
                                        {screens.map((_, index) => (
                                            <motion.button
                                                key={index}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.3, delay: 0.05 * index }}
                                                onClick={() => handleScreenChange(index)}
                                                className={`transition-all duration-300 ${
                                                    activeScreen === index
                                                        ? 'w-6 h-2 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full shadow-md shadow-teal-400/20'
                                                        : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full hover:bg-teal-400 dark:hover:bg-cyan-600'
                                                }`}
                                                aria-label={`Xem màn hình ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                    
                                    <motion.button
                                        className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 backdrop-blur-sm flex items-center justify-center 
                                                   shadow-md shadow-teal-400/20 hover:shadow-lg hover:shadow-teal-500/30 hover:from-teal-500 hover:to-cyan-600 transition-all text-white"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleNext}
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                        
                        {/* Right side - Testimonials */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="space-y-4 md:col-span-4"
                        >
                            <div>
                                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-3">
                                    Người dùng nói gì
                                </h3>
                                
                                <div className="space-y-3">
                                    {testimonials.map((testimonial, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 15 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.4, delay: 0.1 * index }}
                                            className="p-3 rounded-xl bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm"
                                        >
                                            <div className="flex gap-1.5 mb-1.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                    </svg>
                                                ))}
                                            </div>
                                            <p className="text-xs text-gray-600 dark:text-gray-300 italic mb-2">&ldquo;{testimonial.quote}&rdquo;</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-[10px] font-bold">
                                                    {testimonial.author.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-gray-800 dark:text-gray-200">{testimonial.author}</p>
                                                    <p className="text-[10px] text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                            
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.8 }}
                                className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 
                                           border border-teal-100/60 dark:border-teal-800/30 rounded-xl p-3 mt-4"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-md">
                                        <Sparkles className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <h4 className="font-medium text-xs text-gray-800 dark:text-gray-100">Thành tựu</h4>
                                </div>
                                <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                                        <p>100,000+ người dùng tích cực</p>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                                        <p>4.9/5 đánh giá trên App Store</p>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                                        <p>Tiết kiệm trung bình 25% chi tiêu</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>
        </div>
    )
}

<style jsx>{`
    .bg-scanlines {
        background: repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 1px,
            rgba(0, 0, 0, 0.05) 1px,
            rgba(0, 0, 0, 0.05) 2px
        );
    }
    
    .animate-glow {
        animation: glow 3s ease-in-out infinite alternate;
    }
    
    @keyframes glow {
        0% { opacity: 0.5; }
        100% { opacity: 0.8; }
    }
    
    .bg-gradient-radial {
        background-image: radial-gradient(circle, var(--tw-gradient-stops));
    }
    
    .particle-container {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: -1;
    }
    
    .in-view {
        transition: transform 1.2s cubic-bezier(0.17, 0.55, 0.55, 1);
        transform: translateY(0) !important;
    }
`}</style> 