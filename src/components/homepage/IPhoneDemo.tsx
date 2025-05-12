'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Screen1 from '@/images/screens/screen1.jpg'
import Screen2 from '@/images/screens/screen2.jpg'
import Screen3 from '@/images/screens/screen3.jpg'
import Screen4 from '@/images/screens/screen4.jpg'
import Iphone15Pro from './IphoneScreen'

export const IPhoneDemo = () => {
    const [activeScreen, setActiveScreen] = useState(0)
    const [autoplay, setAutoplay] = useState(true)

    const screens = [
        Screen1,
        Screen2,
        Screen3,
        Screen4,
    ]

    const features = [
        "Biểu đồ phân tích chi tiết",
        "Phân loại giao dịch tự động",
        "Lập kế hoạch ngân sách",
        "Báo cáo tài chính theo thời gian thực"
    ]

    // Autoplay functionality
    useEffect(() => {
        if (!autoplay) return

        const interval = setInterval(() => {
            setActiveScreen((prev) => (prev + 1) % screens.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [autoplay, screens.length])

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
        <div className="relative overflow-hidden py-16">
            {/* Background Elements - Updated */}
            <div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent pointer-events-none'></div>
            
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative pb-10"
                id="demo"
            >
                <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Left side - Device Demo */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="flex justify-center"
                        >
                            <div className="relative w-full max-w-[280px] mx-auto">
                                {/* iPhone mockup with floating effect */}
                                <motion.div
                                    className="relative"
                                    animate={{
                                        y: [0, -8, 0],
                                    }}
                                    transition={{ 
                                        duration: 6,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        ease: "easeInOut"
                                    }}
                                >
                                    {/* Subtle glow effect */}
                                    <div className="absolute -inset-0.5 bg-gradient-to-tr from-teal-500/5 via-transparent to-cyan-500/5 rounded-[60px] blur-lg opacity-70 -z-10"></div>
                                    
                                    <div className="relative">
                                        {/* iPhone device */}
                                        <Iphone15Pro
                                            width={280}
                                            className="w-full h-auto"
                                        />
                                        
                                        {/* Screen content */}
                                        <div className="absolute top-[2.2%] left-[4.75%] right-[4.75%] bottom-[2.2%] rounded-[35px] overflow-hidden bg-white dark:bg-gray-900">
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
                                                        <div key={index} className="min-w-full h-full flex-shrink-0 flex items-center justify-center">
                                                            <motion.div 
                                                                className="relative w-full h-full"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ 
                                                                    opacity: activeScreen === index ? 1 : 0.5,
                                                                }}
                                                                transition={{ 
                                                                    duration: 0.3, 
                                                                    ease: "easeInOut" 
                                                                }}
                                                            >
                                                                <Image
                                                                    src={screen}
                                                                    alt={`Màn hình demo ${index + 1}`}
                                                                    priority={index === activeScreen}
                                                                    fill
                                                                    sizes="100%"
                                                                    style={{
                                                                        objectFit: 'contain',
                                                                        objectPosition: 'center',
                                                                    }}
                                                                />
                                                            </motion.div>
                                                        </div>
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
                                                <div className="absolute inset-0 rounded-[35px] shadow-inner"></div>
                                            </div>
                                        </div>
                                        
                                        {/* Screen information overlay */}
                                        <div className="absolute top-2 right-2 text-xs font-medium bg-black/40 backdrop-blur-md text-white rounded-full px-2.5 py-1 shadow-sm">
                                            {activeScreen + 1}/{screens.length}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Navigation buttons - outside the phone frame */}
                                <div className="flex justify-center space-x-3 mt-6">
                                    <motion.button
                                        className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400/80 to-cyan-400/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:shadow-md hover:from-teal-500 hover:to-cyan-500 transition-all text-white"
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
                                                className={`transition-all duration-300 rounded-full ${
                                                    activeScreen === index
                                                        ? 'bg-gradient-to-r from-teal-400 to-cyan-400 w-6 h-2'
                                                        : 'bg-gray-300 dark:bg-gray-600 w-2 h-2 hover:bg-teal-400 dark:hover:bg-cyan-600'
                                                }`}
                                                aria-label={`Xem màn hình ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                    
                                    <motion.button
                                        className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400/80 to-cyan-400/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:shadow-md hover:from-teal-500 hover:to-cyan-500 transition-all text-white"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleNext}
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                        
                        {/* Right side - App Features */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-4 px-4 lg:px-0"
                        >
                            <motion.span
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="inline-block px-3.5 py-1 text-xs font-medium tracking-wide rounded-full bg-teal-50/80 dark:bg-teal-950/30 text-teal-600 dark:text-teal-300 mb-1"
                            >
                                Trải nghiệm trực quan
                            </motion.span>
                            
                            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-500 to-sky-500">
                                Quản lý chi tiêu thông minh
                            </h2>
                            
                            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                                Giao diện người dùng trực quan và dễ sử dụng giúp bạn theo dõi chi tiêu một cách hiệu quả.
                            </p>
                            
                            <div className="space-y-2.5 pt-2">
                                {features.map((feature, index) => (
                                    <motion.div 
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                        className="flex items-center gap-2.5"
                                    >
                                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-teal-400 to-sky-400 flex items-center justify-center">
                                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <span className="text-gray-600 dark:text-gray-300 text-xs">{feature}</span>
                                    </motion.div>
                                ))}
                            </div>
                            
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                            >
                                <Link href="/sign-in" className="inline-flex">
                                    <Button className="mt-4 bg-gradient-to-r from-teal-400 to-sky-400 hover:from-teal-500 hover:to-sky-500 text-white rounded-full px-5 py-2 text-xs shadow-sm hover:shadow-teal-400/20 transition-all duration-300">
                                        Dùng thử miễn phí
                                        <ArrowRight className="ml-1.5 h-3 w-3" />
                                    </Button>
                                </Link>
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
`}</style> 