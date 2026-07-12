import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Bell, User, Settings as SettingsIcon, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFounderContext } from '@/hooks/useFounderContext'

interface TopBarProps {
  sidebarCollapsed: boolean
  breadcrumb?: { label: string; href?: string }[]
  onSearchOpen?: () => void
}

export const TopBar: React.FC<TopBarProps> = ({ sidebarCollapsed, breadcrumb, onSearchOpen }) => {
  const navigate = useNavigate()
  const sidebarWidth = sidebarCollapsed ? 80 : 280
  const { context } = useFounderContext()

  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const avatarInitial = (context.founderName || context.companyName || 'F').trim().charAt(0).toUpperCase() || 'F'

  useEffect(() => {
    if (!notifOpen && !profileOpen) return
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [notifOpen, profileOpen])

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-20 h-[72px]',
        'bg-bg-secondary/80 backdrop-blur-sm border-b border-border-default',
        'flex items-center justify-between px-6 gap-4',
        'transition-all duration-normal',
      )}
      style={{ left: `${sidebarWidth}px` }}
    >
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 overflow-hidden">
        {breadcrumb?.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-text-muted text-small font-body" aria-hidden="true">/</span>}
            <span className={cn(
              'text-small font-body truncate',
              i === breadcrumb.length - 1 ? 'text-text-primary font-medium' : 'text-text-muted',
            )}>
              {crumb.label}
            </span>
          </React.Fragment>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onSearchOpen}
          aria-label="Open search (⌘K)"
          className={cn(
            'flex items-center gap-2 h-9 px-3 rounded-btn',
            'bg-bg-surface border border-border-default',
            'text-text-muted hover:text-text-primary hover:border-border-hover',
            'transition-all duration-fast',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
          )}
        >
          <Search size={14} aria-hidden="true" />
          <span className="text-caption font-body hidden tablet:block">Search</span>
          <kbd className="hidden tablet:flex items-center gap-0.5 text-caption font-mono bg-bg-card-hover px-1.5 py-0.5 rounded border border-border-default">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen(o => !o); setProfileOpen(false) }}
            aria-label="Notifications"
            aria-expanded={notifOpen}
            className={cn(
              'flex items-center justify-center h-9 w-9 rounded-btn',
              'text-text-muted hover:text-text-primary hover:bg-bg-surface',
              'transition-all duration-fast',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
            )}
          >
            <Bell size={16} aria-hidden="true" />
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-11 w-72 bg-bg-secondary rounded-card border border-border-default shadow-elv-4 overflow-hidden z-30"
              >
                <div className="px-4 py-3 border-b border-border-default">
                  <p className="text-small font-body font-semibold text-text-primary">Notifications</p>
                </div>
                <div className="px-4 py-8 text-center">
                  <p className="text-caption font-body text-text-muted">No notifications</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setProfileOpen(o => !o); setNotifOpen(false) }}
            aria-label="User profile"
            aria-expanded={profileOpen}
            className={cn(
              'h-8 w-8 rounded-full flex items-center justify-center shrink-0 cursor-pointer',
              'bg-gradient-to-br from-brand to-brand-pressed',
              'ring-2 ring-transparent hover:ring-brand/40 transition-all duration-fast',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
            )}
          >
            <span className="text-caption font-bold text-white font-heading">{avatarInitial}</span>
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-11 w-56 bg-bg-secondary rounded-card border border-border-default shadow-elv-4 overflow-hidden z-30"
              >
                <div className="px-4 py-3 border-b border-border-default">
                  <p className="text-small font-body font-semibold text-text-primary truncate">
                    {context.founderName || context.companyName || 'Founder'}
                  </p>
                  {context.founderEmail && (
                    <p className="text-caption font-body text-text-muted truncate">{context.founderEmail}</p>
                  )}
                </div>
                <div className="py-1">
                  <button
                    onClick={() => { setProfileOpen(false); navigate('/settings') }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-small font-body text-text-secondary hover:bg-bg-card-hover hover:text-text-primary transition-colors duration-fast"
                  >
                    <User size={14} aria-hidden="true" />
                    Profile
                  </button>
                  <button
                    onClick={() => { setProfileOpen(false); navigate('/settings') }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-small font-body text-text-secondary hover:bg-bg-card-hover hover:text-text-primary transition-colors duration-fast"
                  >
                    <SettingsIcon size={14} aria-hidden="true" />
                    Settings
                  </button>
                </div>
                <div className="py-1 border-t border-border-default">
                  <button
                    onClick={() => { setProfileOpen(false); navigate('/login') }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-small font-body text-crimson hover:bg-crimson/10 transition-colors duration-fast"
                  >
                    <LogOut size={14} aria-hidden="true" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
