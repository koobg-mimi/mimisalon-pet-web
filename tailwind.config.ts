import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      // Mobile-first responsive breakpoints
      screens: {
        xs: '475px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },

      // Safe area support for mobile devices
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },

      // Enhanced mobile typography
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        // Mobile-optimized font sizes
        'mobile-xs': ['0.75rem', { lineHeight: '1.25rem' }],
        'mobile-sm': ['0.875rem', { lineHeight: '1.375rem' }],
        'mobile-base': ['1rem', { lineHeight: '1.625rem' }],
        'mobile-lg': ['1.125rem', { lineHeight: '1.875rem' }],
        'mobile-xl': ['1.25rem', { lineHeight: '2rem' }],
      },

      // Mobile-friendly colors
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Mobile-specific colors
        'mobile-primary': '#3B82F6',
        'mobile-secondary': '#64748B',
        'mobile-success': '#10B981',
        'mobile-warning': '#F59E0B',
        'mobile-error': '#EF4444',
        'mobile-info': '#06B6D4',
      },

      // Mobile-optimized border radius
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        // Mobile-friendly radii
        'mobile-xs': '0.25rem',
        'mobile-sm': '0.375rem',
        'mobile-md': '0.5rem',
        'mobile-lg': '0.75rem',
        'mobile-xl': '1rem',
      },

      // Touch-friendly shadows
      boxShadow: {
        'mobile-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'mobile-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'mobile-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'mobile-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },

      // Animation for mobile interactions
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        // Mobile-specific animations
        'slide-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-down': {
          from: { transform: 'translateY(-100%)' },
          to: { transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'scale-in': {
          from: { transform: 'scale(0.95)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'bounce-in': 'bounce-in 0.6s ease-out',
      },

      // Grid templates for mobile layouts
      gridTemplateColumns: {
        'mobile-1': 'repeat(1, minmax(0, 1fr))',
        'mobile-2': 'repeat(2, minmax(0, 1fr))',
        'mobile-auto-fit': 'repeat(auto-fit, minmax(280px, 1fr))',
        'mobile-auto-fill': 'repeat(auto-fill, minmax(280px, 1fr))',
      },

      // Mobile-optimized heights
      height: {
        'screen-safe': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
        'screen-dynamic': '100dvh', // Dynamic viewport height
      },

      // Mobile-optimized widths
      maxWidth: {
        'mobile-xs': '320px',
        'mobile-sm': '480px',
        'mobile-md': '640px',
        'mobile-lg': '768px',
      },

      // Z-index scale for mobile layering
      zIndex: {
        'mobile-dropdown': '1000',
        'mobile-sticky': '1020',
        'mobile-fixed': '1030',
        'mobile-modal-backdrop': '1040',
        'mobile-modal': '1050',
        'mobile-popover': '1060',
        'mobile-tooltip': '1070',
        'mobile-toast': '1080',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    // Plugin for safe area utilities
    function ({ addUtilities }: { addUtilities: any }) {
      const newUtilities = {
        '.safe-top': {
          paddingTop: 'env(safe-area-inset-top)',
        },
        '.safe-bottom': {
          paddingBottom: 'env(safe-area-inset-bottom)',
        },
        '.safe-left': {
          paddingLeft: 'env(safe-area-inset-left)',
        },
        '.safe-right': {
          paddingRight: 'env(safe-area-inset-right)',
        },
        '.safe-all': {
          padding:
            'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
        },
        '.safe-x': {
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        },
        '.safe-y': {
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        },
        // Mobile-specific utilities
        '.touch-manipulation': {
          touchAction: 'manipulation',
        },
        '.overscroll-none': {
          overscrollBehavior: 'none',
        },
        '.overscroll-y-none': {
          overscrollBehaviorY: 'none',
        },
        '.overscroll-x-none': {
          overscrollBehaviorX: 'none',
        },
        '.scroll-smooth': {
          scrollBehavior: 'smooth',
        },
        '.scroll-auto': {
          scrollBehavior: 'auto',
        },
        // Mobile viewport utilities
        '.h-screen-safe': {
          height: 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
        },
        '.min-h-screen-safe': {
          minHeight: 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
        },
        '.h-screen-dynamic': {
          height: '100dvh',
        },
        '.min-h-screen-dynamic': {
          minHeight: '100dvh',
        },
      }

      addUtilities(newUtilities, ['responsive', 'hover'])
    },
  ],
}

export default config
