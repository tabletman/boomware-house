'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ProductImageProps {
  src: string
  alt: string
  fill?: boolean
  className?: string
}

export function ProductImage({ src, alt, fill = false, className = '' }: ProductImageProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <Image
      src={imageError ? '/images/placeholder.svg' : src}
      alt={alt}
      fill={fill}
      className={className}
      onError={() => setImageError(true)}
    />
  )
}