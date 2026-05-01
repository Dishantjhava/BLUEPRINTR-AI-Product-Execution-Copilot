/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          dark: '#0B0F19',
          light: '#F9FAFB',
        },
        card: {
          dark: '#111827',
          light: '#FFFFFF',
        },
        accent: {
          dark: '#6366F1',
          light: '#4F46E5',
        },
        secondary: {
          dark: '#22C55E',
          light: '#16A34A',
        },
        text: {
          dark: '#E5E7EB',
          light: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(99, 102, 241, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)' },
        },
      },
    },
  },
  plugins: [],
}
