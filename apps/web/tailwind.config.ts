import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Prayer Atlas brand palette
        atlas: {
          navy:    '#0F2744',
          blue:    '#1A5DA6',
          sky:     '#4A9FD4',
          sand:    '#F5F0E8',
          warm:    '#E8D5B0',
          accent:  '#D97706',
          success: '#16A34A',
          muted:   '#6B7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
