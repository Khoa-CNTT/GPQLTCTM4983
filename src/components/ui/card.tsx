'use client'

import { useState } from 'react'
import Image, { StaticImageData } from 'next/image'
import { motion } from 'framer-motion'
import { ExternalLink, ChevronRight } from 'lucide-react'
import { cn } from '@/libraries/utils'

interface CardProps {
  title: string
  subtitle?: string
  description?: string
  image?: string | StaticImageData
  imageAlt?: string
  footer?: React.ReactNode
  badge?: string
  link?: string
  className?: string
  hoverEffect?: 'lift' | 'glow' | 'border' | 'none'
  variant?: 'default' | 'gradient' | 'minimal'
  aspectRatio?: 'auto' | 'square' | 'video' | 'wide'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  children?: React.ReactNode
}

export function Card({
  title,
  subtitle,
  description,
  image,
  imageAlt,
  footer,
  badge,
  link,
  className,
  hoverEffect = 'lift',
  variant = 'default',
  aspectRatio = 'auto',
  size = 'md',
  onClick,
  children,
}: CardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const cardContent = (
    <div 
      className={cn(
        'rounded-xl overflow-hidden transition-all duration-300',
        'bg-white dark:bg-gray-800/95 shadow-md',
        {
          'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800/95 dark:to-gray-900/90': variant === 'gradient',
          'border border-gray-100 dark:border-gray-800 bg-transparent shadow-none': variant === 'minimal',
          'scale-[1.02] shadow-xl': isHovered && hoverEffect === 'lift',
          'shadow-lg shadow-violet-500/20': isHovered && hoverEffect === 'glow',
          'border-violet-400 dark:border-violet-500/50': isHovered && hoverEffect === 'border',
          'p-3': size === 'sm',
          'p-4': size === 'md',
          'p-5': size === 'lg',
        },
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {image && (
        <div className={cn(
          'relative w-full overflow-hidden',
          {
            'h-48': size === 'sm',
            'h-56': size === 'md',
            'h-64': size === 'lg',
            'aspect-square': aspectRatio === 'square',
            'aspect-video': aspectRatio === 'video',
            'aspect-[2/1]': aspectRatio === 'wide',
          }
        )}>
          <Image
            src={image}
            alt={imageAlt || title}
            fill
            className={cn(
              'object-cover transition-transform duration-700',
              isHovered && 'scale-105'
            )}
            priority
          />
          {badge && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-violet-500 to-rose-500 text-white text-xs px-3 py-1 rounded-full shadow-md">
              {badge}
            </div>
          )}
        </div>
      )}
      
      <div className="relative space-y-3 p-4">
        {badge && !image && (
          <div className="inline-block bg-gradient-to-r from-violet-100 to-rose-100 text-violet-600 dark:from-violet-900/30 dark:to-rose-900/30 dark:text-violet-300 text-xs px-3 py-1 rounded-full mb-2">
            {badge}
          </div>
        )}
        
        <h3 className={cn(
          'font-bold text-gray-900 dark:text-white',
          {
            'text-lg': size === 'sm',
            'text-xl': size === 'md',
            'text-2xl': size === 'lg'
          }
        )}>
          {title}
        </h3>
        
        {subtitle && (
          <p className="text-sm text-violet-600 dark:text-violet-400">
            {subtitle}
          </p>
        )}
        
        {description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {description}
          </p>
        )}
        
        {children}
        
        {footer && (
          <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700/50">
            {footer}
          </div>
        )}
        
        {link && (
          <div className="absolute bottom-4 right-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: isHovered ? 1 : 0.9, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="p-2 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400"
            >
              <ChevronRight size={16} />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
  
  if (link) {
    return (
      <a 
        href={link}
        className="block no-underline"
        target="_blank" 
        rel="noopener noreferrer"
      >
        {cardContent}
      </a>
    )
  }
  
  return cardContent
}

// For convenient exports
export const CardFooter = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("flex items-center gap-3", className)}>
    {children}
  </div>
)

export const CardAction = ({ 
  children, 
  href, 
  variant = 'primary' 
}: { 
  children: React.ReactNode, 
  href?: string,
  variant?: 'primary' | 'secondary' | 'outline' | 'text'
}) => {
  const baseClasses = "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200"
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-violet-600 to-rose-500 text-white hover:shadow-md hover:shadow-violet-500/20",
    secondary: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700",
    outline: "border border-gray-200 dark:border-gray-700 hover:border-violet-400 dark:hover:border-violet-500/50 hover:text-violet-600 dark:hover:text-violet-400",
    text: "text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20"
  }
  
  const ButtonContent = () => (
    <span className={cn(baseClasses, variantClasses[variant])}>
      {children}
      {variant === 'primary' && <ExternalLink size={14} />}
    </span>
  )
  
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <ButtonContent />
    </a>
  ) : (
    <ButtonContent />
  )
}
