/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#191919', // Dark primary charcoal
          cream: '#FDF0D5',   // Pastel warm cream
          darker: '#121212',
          lighter: '#222222',
        },
        brand: {
          orange: '#FF6B35',  // Vibrant accent orange
          accent: '#E65F2B',
          blue: '#4281F3',    // Portfolio Blue
          lime: '#BFF168',    // Portfolio Lime
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#B3B3B3',
          dark: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Syne', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
