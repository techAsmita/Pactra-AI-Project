import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges class names with Tailwind deduplication.
 * Use this everywhere instead of string concatenation.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
