/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#f0f9ff',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
          },
          success: {
            500: '#10b981',
            600: '#059669',
          },
          warning: {
            500: '#f59e0b',
            600: '#d97706',
          },
          danger: {
            500: '#ef4444',
            600: '#dc2626',
          },
        },
        animation: {
          'swipe-left': 'swipeLeft 0.3s ease-out',
          'swipe-right': 'swipeRight 0.3s ease-out',
        },
        keyframes: {
          swipeLeft: {
            '0%': { transform: 'translateX(0) rotate(0deg)' },
            '100%': { transform: 'translateX(-100%) rotate(-10deg)' },
          },
          swipeRight: {
            '0%': { transform: 'translateX(0) rotate(0deg)' },
            '100%': { transform: 'translateX(100%) rotate(10deg)' },
          },
        },
      },
    },
    plugins: [],
  }