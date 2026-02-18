/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#06080F',
          elevated: '#0A0D1A',
          surface: 'rgba(255,255,255,0.025)',
        },
        border: {
          subtle: 'rgba(255,255,255,0.06)',
          strong: 'rgba(255,255,255,0.12)',
        },
        primary: {
          DEFAULT: '#3B82F6',
          dim: 'rgba(59,130,246,0.15)',
          muted: 'rgba(59,130,246,0.08)',
        },
        accent: {
          DEFAULT: '#0EA5E9',
          dim: 'rgba(14,165,233,0.15)',
        },
        success: {
          DEFAULT: '#10B981',
          dim: 'rgba(16,185,129,0.15)',
        },
        warning: {
          DEFAULT: '#F59E0B',
          dim: 'rgba(245,158,11,0.15)',
        },
        danger: {
          DEFAULT: '#EF4444',
          dim: 'rgba(239,68,68,0.15)',
        },
        text: {
          primary: '#E2E8F0',
          secondary: '#94A3B8',
          muted: '#475569',
          dim: '#334155',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        card: '18px',
        'card-sm': '12px',
        'card-lg': '22px',
      },
      backdropBlur: {
        card: '24px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)',
        glow: '0 0 20px rgba(59,130,246,0.2)',
      },
    },
  },
  plugins: [],
};
