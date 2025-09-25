import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

export function generateSKU(category: string, brand?: string): string {
  const categoryCode = category.substring(0, 3).toUpperCase()
  const brandCode = brand ? brand.substring(0, 2).toUpperCase() : 'XX'
  const timestamp = Date.now().toString().slice(-6)
  return `${categoryCode}-${brandCode}-${timestamp}`
}

export function getConditionColor(condition: string): string {
  switch (condition) {
    case 'Grade A':
      return 'text-green-600 bg-green-50 border-green-200'
    case 'Grade B':
      return 'text-blue-600 bg-blue-50 border-blue-200'
    case 'Grade C':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'Grade D':
      return 'text-red-600 bg-red-50 border-red-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export function getConditionDescription(condition: string): string {
  switch (condition) {
    case 'Grade A':
      return 'Excellent condition with minimal signs of use'
    case 'Grade B':
      return 'Good condition with light wear but fully functional'
    case 'Grade C':
      return 'Fair condition with noticeable wear but working properly'
    case 'Grade D':
      return 'Poor cosmetic condition but fully functional'
    default:
      return 'Condition not specified'
  }
}

export function calculateDiscountPercentage(price: number, compareAtPrice: number): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
}

export function generateOrderNumber(): string {
  const date = new Date()
  const dateStr = date.getFullYear().toString() +
                  (date.getMonth() + 1).toString().padStart(2, '0') +
                  date.getDate().toString().padStart(2, '0')
  const timeStr = Date.now().toString().slice(-4)
  return `BW${dateStr}${timeStr}`
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/
  return phoneRegex.test(phone)
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export function debounce<T extends (...args: never[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}