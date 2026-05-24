export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        app: {
          bg: '#F7F4EE',
          surface: '#FFFFFF',
          mutedBg: '#EDE9E0',
          code: '#F0EBE1',
          text: '#1A1612',
          muted: '#6B6258',
          accent: '#D4502A',
          amber: '#E8963A',
          success: '#2D7A4F',
          error: '#C0392B',
          border: '#D8D2C8',
          highlight: '#FFF3CD',
        },
      },
      boxShadow: {
        paper: '0 1px 0 rgba(26,22,18,0.05)',
      },
      borderRadius: {
        xl2: '0.875rem',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        mono: ['DM Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        sans: ['Geist', 'IBM Plex Sans', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(-18px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(18px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        cardIn: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        slideLeft: 'slideLeft 420ms cubic-bezier(0.4, 0, 0.2, 1) 200ms both',
        slideRight: 'slideRight 420ms cubic-bezier(0.4, 0, 0.2, 1) 300ms both',
        cardIn: 'cardIn 360ms cubic-bezier(0.4, 0, 0.2, 1) both',
      },
    },
  },
  plugins: [],
};
