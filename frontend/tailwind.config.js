/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Enhanced Primary Colors (more vibrant blue)
        primary: {
          DEFAULT: '#0066cc',
          50: '#e6f1ff',
          100: '#b3d9ff',
          200: '#80c1ff',
          300: '#4da9ff',
          400: '#1a91ff',
          500: '#0066cc',
          600: '#0052a3',
          700: '#003d7a',
          800: '#002952',
          dark: '#001429',
        },
        // Enhanced Victory Colors (more saturated green)
        victory: {
          DEFAULT: '#10b981',
          50: '#d1fae5',
          100: '#a7f3d0',
          200: '#6ee7b7',
          300: '#34d399',
          400: '#10b981',
          500: '#059669',
          600: '#047857',
          dark: '#065f46',
          light: '#d1fae5',
        },
        // Enhanced Defeat Colors (more vibrant red)
        defeat: {
          DEFAULT: '#ef4444',
          50: '#fee2e2',
          100: '#fecaca',
          200: '#fca5a5',
          300: '#f87171',
          400: '#ef4444',
          500: '#dc2626',
          600: '#b91c1c',
          dark: '#991b1b',
          light: '#fee2e2',
        },
        // Draw Colors (neutral gray)
        draw: {
          DEFAULT: '#6b7280',
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          dark: '#374151',
          light: '#f3f4f6',
        },
        // Accent Colors
        accent: {
          orange: '#ff6b35',
          teal: '#00c2a8',
          purple: '#8b5cf6',
        },
        // Keep neutral scale
        neutral: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
        'gradient-card': 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        'gradient-page': 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
        'gradient-stats-blue': 'linear-gradient(135deg, #e6f1ff 0%, #b3d9ff 100%)',
        'gradient-stats-green': 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
        'gradient-stats-orange': 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)',
        'gradient-stats-purple': 'linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%)',
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '120': '30rem',
      },
      borderRadius: {
        card: '0.75rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
