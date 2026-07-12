import React, { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { GlobalSearch } from '@/components/layout/GlobalSearch'
import { cn } from '@/lib/utils'

// ─── Keyboard shortcut handler ─────────────────────────────────────────────
function useGlobalShortcuts(onSearch: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onSearch()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onSearch])
}

// ─── Breadcrumb from route ─────────────────────────────────────────────────
function useBreadcrumb() {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  const labelMap: Record<string, string> = {
    workspace: 'Workspace',
    contracts: 'Contracts',
    negotiations: 'Negotiations',
    analytics: 'Analytics',
    settings: 'Settings',
    new: 'New Agreement',
    analysis: 'AI Analysis',
    decision: 'Decision Center',
    negotiate: 'Negotiation',
  }

  return segments.map((seg) => ({
    label: labelMap[seg] || seg.charAt(0).toUpperCase() + seg.slice(1),
  }))
}

// ─── AppShell ──────────────────────────────────────────────────────────────
export const AppShell: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const breadcrumb = useBreadcrumb()

  useGlobalShortcuts(() => setSearchOpen(true))

  const sidebarWidth = sidebarCollapsed ? 80 : 280

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Skip to main content */}
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>

      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />

      {/* Main content area */}
      <motion.div
        initial={false}
        animate={{ marginLeft: sidebarWidth }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          'flex-1 flex flex-col min-h-screen',
          // Mobile: no margin (sidebar is hidden)
          'max-desktop:!ml-0',
        )}
      >
        <TopBar
          sidebarCollapsed={sidebarCollapsed}
          breadcrumb={breadcrumb}
          onSearchOpen={() => setSearchOpen(true)}
        />

        <main
          id="main-content"
          tabIndex={-1}
          className={cn(
            'flex-1',
            'focus:outline-none',
          )}
          style={{ paddingTop: '72px' }}
        >
          <Outlet />
        </main>
      </motion.div>

      {/* Global search command palette */}
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
