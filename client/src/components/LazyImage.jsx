import { memo } from 'react'
import { motion } from 'framer-motion'
import { useLazyImage } from '../hooks/usePerformance'
import { PhotoIcon } from '@heroicons/react/24/outline'

const LazyImage = memo(({ 
  src, 
  alt, 
  className = '', 
  placeholder,
  onLoad,
  onError,
  ...props 
}) => {
  // Create a blurred placeholder if none provided
  const defaultPlaceholder = `data:image/svg+xml;base64,${btoa(`
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#e2e8f0;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#cbd5e1;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <circle cx="200" cy="150" r="30" fill="#94a3b8" opacity="0.5"/>
    </svg>
  `)}`

  const { ref, imageSrc, isLoaded, isError } = useLazyImage(
    src, 
    placeholder || defaultPlaceholder
  )

  if (isError) {
    return (
      <div 
        ref={ref} 
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}
        {...props}
      >
        <PhotoIcon className="w-8 h-8 text-gray-400" />
      </div>
    )
  }

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} {...props}>
      <motion.img
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-500 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-70 scale-105'
        }`}
        onLoad={() => {
          onLoad?.()
        }}
        onError={onError}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0.7 }}
        transition={{ duration: 0.5 }}
      />
      
      {!isLoaded && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700"
          animate={{ x: ['0%', '100%', '0%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </div>
  )
})

LazyImage.displayName = 'LazyImage'

export default LazyImage