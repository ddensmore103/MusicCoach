import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#EF4444',
          'red-dark': '#DC2626',
          purple: '#8B5CF6',
          indigo: '#6366F1',
          blue: '#3B82F6',
        },
        surface: {
          primary: '#FFFFFF',
          secondary: '#F8FAFC',
          tertiary: '#F1F5F9',
        },
        text: {
          primary: '#0F172A',
          secondary: '#64748B',
          tertiary: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 20px rgba(0, 0, 0, 0.12)',
        nav: '0 -2px 16px rgba(0, 0, 0, 0.06)',
        record: '0 4px 24px rgba(239, 68, 68, 0.4)',
      },
      animation: {
        'pulse-record': 'pulse-record 1.5s ease-in-out infinite',
      },
      keyframes: {
        'pulse-record': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.08)', opacity: '0.9' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
