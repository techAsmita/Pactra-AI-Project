import React from 'react'
import { cn } from '@/lib/utils'

interface PageContainerProps {
  children: React.ReactNode
  className?: string
  narrow?: boolean
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, className, narrow = false }) => {
  return (
    <div className={cn(
      'mx-auto w-full px-4 tablet:px-10 desktop:px-20',
      narrow ? 'max-w-3xl' : 'max-w-content',
      className,
    )}>
      {children}
    </div>
  )
}
