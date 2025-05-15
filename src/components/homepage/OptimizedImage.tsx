'use client'

import Image from 'next/image'
import { useState, memo } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
  className?: string
  sizes?: string
  quality?: number
  fill?: boolean
  style?: React.CSSProperties
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
}

/**
 * OptimizedImage component for better performance
 * - Implements blur-up loading effect
 * - Handles loading errors
 * - Optimizes image loading based on viewport
 * - Supports SEO-friendly alt text
 */
const OptimizedImage = memo(({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 85,
  fill = false,
  style,
  objectFit = 'cover',
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  // Common props for both fill and fixed images
  const commonProps = {
    quality,
    priority,
    onLoadingComplete: () => setIsLoading(false),
    onError: () => setIsError(true),
    className: `transition-opacity duration-300 ${
      isLoading ? 'opacity-0' : 'opacity-100'
    } ${className}`,
  }

  // Show placeholder if image fails to load
  if (isError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}
        style={{ 
          width: fill ? '100%' : width, 
          height: fill ? '100%' : height,
          ...style
        }}
      >
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {alt || 'Không thể tải hình ảnh'}
        </span>
      </div>
    )
  }

  // If fill mode is enabled
  if (fill) {
    return (
      <div className="relative" style={{ width: '100%', height: '100%', ...style }}>
        <Image
          {...commonProps}
          src={src}
          alt={alt || "Hình ảnh tối ưu"}
          fill={true}
          sizes={sizes}
          style={{ objectFit }}
          loading={priority ? 'eager' : 'lazy'}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmM2Y0ZjYiIHN0b3Atb3BhY2l0eT0iLjUiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlNWU3ZWIiIHN0b3Atb3BhY2l0eT0iLjUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBmaWxsPSJ1cmwoI2cpIiBkPSJNMCAwaDYwMHY2MDBIMHoiLz48L3N2Zz4="
        />
      </div>
    )
  }

  // Fixed size image
  return (
    <Image
      {...commonProps}
      src={src}
      alt={alt || "Hình ảnh tối ưu"}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmM2Y0ZjYiIHN0b3Atb3BhY2l0eT0iLjUiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlNWU3ZWIiIHN0b3Atb3BhY2l0eT0iLjUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBmaWxsPSJ1cmwoI2cpIiBkPSJNMCAwaDYwMHY2MDBIMHoiLz48L3N2Zz4="
      sizes={sizes}
      style={{ ...style, objectFit }}
    />
  )
})

OptimizedImage.displayName = 'OptimizedImage'

export default OptimizedImage 