/**
 * Utility functions for handling paths in GitHub Pages deployment
 */

/**
 * Gets the base path for the current environment
 * Returns '/boomware-house' in production (GitHub Pages) or '' in development
 */
export function getBasePath(): string {
  return process.env.NODE_ENV === 'production' ? '/boomware-house' : ''
}

/**
 * Prepends the base path to an image URL if needed
 * @param imagePath - The image path (e.g., '/images/products/image.jpg')
 * @returns The full path with base path prepended if in production
 */
export function getImageUrl(imagePath: string): string {
  // If it's already a full URL or doesn't start with /, return as is
  if (!imagePath.startsWith('/')) {
    return imagePath
  }

  const basePath = getBasePath()
  return `${basePath}${imagePath}`
}