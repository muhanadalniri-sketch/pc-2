import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ui-sans-serif','system-ui','-apple-system','Segoe UI','Roboto','Noto Sans','Ubuntu','Cantarell','Helvetica Neue','Arial','Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol']
      },
      boxShadow: {
        'concave': 'inset 2px 2px 6px rgba(0,0,0,0.25), inset -2px -2px 6px rgba(255,255,255,0.6)',
        'concave-deep': 'inset 3px 3px 10px rgba(0,0,0,0.35), inset -3px -3px 10px rgba(255,255,255,0.8)',
      }
    },
  },
  plugins: [],
}
export default config
