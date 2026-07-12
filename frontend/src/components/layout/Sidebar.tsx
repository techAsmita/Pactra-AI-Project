import React from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FileText, MessageSquare, BarChart3,
  Settings, ChevronLeft, ChevronRight, Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Workspace', href: '/workspace', icon: LayoutDashboard },
  { label: 'Contracts', href: '/contracts', icon: FileText },
  { label: 'Negotiations', href: '/negotiations', icon: MessageSquare },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation()

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        'fixed left-0 top-0 bottom-0 z-30',
        'bg-bg-secondary border-r border-border-default',
        'flex flex-col overflow-hidden shrink-0',
        'hidden desktop:flex',
      )}
      aria-label="Main navigation"
    >
      {/* Logo — navigates to landing page */}
      <Link
        to="/"
        className={cn(
          'flex items-center h-topbar border-b border-border-default shrink-0 px-5 gap-3',
          'hover:bg-bg-surface transition-colors duration-fast',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset',
          collapsed && 'justify-center px-0',
        )}
        aria-label="Go to Pactra home"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-btn bg-brand shrink-0">
          <Zap size={16} className="text-white" aria-hidden="true" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="font-heading font-bold text-h4 text-text-primary overflow-hidden whitespace-nowrap"
            >
              Pactra
            </motion.span>
          )}
        </AnimatePresence>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 p-3 overflow-y-auto" role="navigation">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = location.pathname.startsWith(href)
          return (
            <NavLink
              key={href}
              to={href}
              aria-current={isActive ? 'page' : undefined}
              title={collapsed ? label : undefined}
              className={cn(
                'flex items-center gap-3 rounded-btn px-3 h-11',
                'transition-all duration-fast',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset',
                collapsed && 'justify-center px-0',
                isActive
                  ? 'bg-brand text-white'
                  : 'text-text-muted hover:bg-bg-surface hover:text-text-primary',
              )}
            >
              <Icon size={20} className="shrink-0" aria-hidden="true" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-small font-medium font-body overflow-hidden whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          )
        })}
      </nav>

      {/* Bottom — Settings + Collapse toggle */}
      <div className="p-3 border-t border-border-default flex flex-col gap-1 shrink-0">
        <NavLink
          to="/settings"
          aria-current={location.pathname === '/settings' ? 'page' : undefined}
          title={collapsed ? 'Settings' : undefined}
          className={cn(
            'flex items-center gap-3 rounded-btn px-3 h-11',
            'transition-all duration-fast',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset',
            collapsed && 'justify-center px-0',
            location.pathname === '/settings'
              ? 'bg-brand text-white'
              : 'text-text-muted hover:bg-bg-surface hover:text-text-primary',
          )}
        >
          <Settings size={20} className="shrink-0" aria-hidden="true" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-small font-medium font-body overflow-hidden whitespace-nowrap"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>

        <button
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'flex items-center gap-3 rounded-btn px-3 h-11 w-full',
            'text-text-muted hover:bg-bg-surface hover:text-text-primary',
            'transition-all duration-fast',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset',
            collapsed && 'justify-center px-0',
          )}
        >
          {collapsed
            ? <ChevronRight size={20} className="shrink-0" aria-hidden="true" />
            : <ChevronLeft size={20} className="shrink-0" aria-hidden="true" />
          }
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-small font-medium font-body overflow-hidden whitespace-nowrap"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  )
}
