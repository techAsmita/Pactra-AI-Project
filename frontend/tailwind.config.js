/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0B1020',
        'bg-secondary': '#121A2B',
        'bg-surface': '#182235',
        'bg-card-hover': '#1F2B42',
        brand: {
          DEFAULT: '#6366F1',
          hover: '#7C83FF',
          pressed: '#5558E8',
        },
        emerald: { DEFAULT: '#10B981' },
        amber: { DEFAULT: '#F59E0B' },
        crimson: { DEFAULT: '#EF4444', deep: '#DC2626' },
        success: { DEFAULT: '#22C55E' },
        'text-primary': '#F8FAFC',
        'text-secondary': '#CBD5E1',
        'text-muted': '#94A3B8',
        'text-disabled': '#64748B',
        'border-default': '#243047',
        'border-hover': '#334155',
        'border-focus': '#6366F1',
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        display: ['56px', { lineHeight: '1.1', fontWeight: '700' }],
        h1: ['40px', { lineHeight: '1.2', fontWeight: '700' }],
        h2: ['32px', { lineHeight: '1.25', fontWeight: '600' }],
        h3: ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        h4: ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.6' }],
        body: ['16px', { lineHeight: '1.6' }],
        small: ['14px', { lineHeight: '1.5' }],
        caption: ['12px', { lineHeight: '1.4' }],
      },
      spacing: {
        1: '4px', 2: '8px', 3: '12px', 4: '16px', 5: '20px',
        6: '24px', 8: '32px', 10: '40px', 12: '48px',
        16: '64px', 20: '80px', 24: '96px',
      },
      borderRadius: {
        btn: '12px', card: '20px', input: '14px',
        modal: '24px', drawer: '24px', badge: '999px',
      },
      boxShadow: {
        'elv-0': 'none',
        'elv-1': '0 2px 8px rgba(15,23,42,0.08)',
        'elv-2': '0 6px 16px rgba(15,23,42,0.10)',
        'elv-3': '0 12px 24px rgba(15,23,42,0.14)',
        'elv-4': '0 20px 40px rgba(15,23,42,0.18)',
      },
      transitionDuration: {
        fast: '150ms', normal: '250ms', slow: '400ms', long: '600ms',
      },
      screens: {
        tablet: '768px', desktop: '1024px', large: '1440px',
      },
      maxWidth: { content: '1280px', container: '1440px' },
      width: { sidebar: '280px', 'sidebar-collapsed': '80px' },
      height: { topbar: '72px' },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        agentPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite linear',
        'fade-in': 'fadeIn 250ms ease-out',
        'slide-in-right': 'slideInRight 300ms ease-out',
        'slide-in-up': 'slideInUp 300ms ease-out',
        'scale-in': 'scaleIn 250ms ease-out',
        'agent-pulse': 'agentPulse 800ms ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
