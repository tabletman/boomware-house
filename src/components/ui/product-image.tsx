'use client'

import Image from 'next/image'
import { useState } from 'react'
import { getImageUrl } from '@/lib/paths'

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
      src={imageError ? getImageUrl('/images/placeholder.svg') : getImageUrl(src)}
      alt={alt}
      fill={fill}
      className={className}
      onError={() => setImageError(true)}
    />
  )
}