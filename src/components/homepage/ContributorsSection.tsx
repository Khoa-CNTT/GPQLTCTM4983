'use client'

import { motion, useInView } from 'framer-motion'
import Image, { StaticImageData } from 'next/image'
import { Github, Facebook } from 'lucide-react'
import { useRef, useState } from 'react'
import { cn } from '@/libraries/utils'

interface Contributor {
  name: string
  role: string
  image: StaticImageData
  srcGit: string
  facebookUrl?: string
  priority?: boolean
}

interface ContributorsSectionProps {
  contributors: Contributor[]
}

export default function ContributorsSection({ contributors }: ContributorsSectionProps) {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section ref={sectionRef} className='relative py-24 overflow-hidden'>
      {/* Background Elements */}
      <div className='absolute top-0 left-0 right-0 h-40 bg-transparent pointer-events-none'></div>
      
      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className='inline-block'
          >
            <span className='inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-gradient-to-r from-violet-100 to-rose-100 text-violet-600 dark:from-violet-900/30 dark:to-rose-900/30 dark:text-violet-300'>
              Đội ngũ của chúng tôi
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className='text-2xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-rose-500'
          >
            Những người đóng góp
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='max-w-2xl mx-auto text-base text-gray-600 dark:text-gray-300'
          >
            Gặp gỡ những người sáng tạo tài năng đứng sau dự án UNIKO
          </motion.p>
        </div>

        {/* Contributors Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10'>
          {contributors.map((contributor, index) => (
            <motion.div
              key={contributor.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className='relative group'
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className={cn(
                'relative flex flex-col rounded-xl overflow-hidden bg-white/95 dark:bg-gray-800/95 shadow-lg transition-all duration-300',
                hovered === index ? 'shadow-xl shadow-violet-500/10 scale-[1.02]' : '',
                hovered !== null && hovered !== index && 'blur-sm scale-[0.98] opacity-75'
              )}>
                <div className='relative h-60 md:h-72 w-full'>
                  <Image
                    src={contributor.image}
                    alt={contributor.name}
                    fill
                    className='object-cover transition-transform duration-700'
                    priority={contributor.priority}
                  />
                </div>
                
                <div className="relative w-full p-4">
                  <h3 className='text-xl font-bold text-gray-900 dark:text-white'>{contributor.name}</h3>
                  <p className='text-sm text-violet-600 dark:text-violet-400 mb-4'>{contributor.role}</p>
                  
                  <div className='w-full pt-4 border-t border-gray-100 dark:border-gray-700/50'>
                    <div className='flex gap-4'>
                      <a
                        href={contributor.srcGit}
                        target="_blank"
                        rel="noopener noreferrer"
                        className='p-2 rounded-full bg-gray-100 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 hover:bg-violet-100 hover:text-violet-600 dark:hover:bg-violet-900/40 dark:hover:text-violet-400 transition-all duration-300'
                        aria-label={`GitHub profile of ${contributor.name}`}
                      >
                        <Github size={18} />
                      </a>
                      <a
                        href={contributor.facebookUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className='p-2 rounded-full bg-gray-100 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/40 dark:hover:text-blue-400 transition-all duration-300'
                        aria-label={`Facebook profile of ${contributor.name}`}
                      >
                        <Facebook size={18} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Join Us Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className='mt-16 text-center'
        >
          <a 
            href="https://github.com/auroraphtgrp01/fe-uniko" 
            target="_blank" 
            rel="noopener noreferrer"
            className='inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 to-rose-500 text-white font-medium shadow-lg hover:shadow-violet-500/25 transition-all duration-300'
          >
            <Github size={20} />
            Đóng góp với chúng tôi
          </a>
        </motion.div>
      </div>
    </section>
  )
}
