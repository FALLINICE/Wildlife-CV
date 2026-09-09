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
        nature: {
          950: '#070D09',
          900: '#0F1A13',
          850: '#15241B',
          800: '#1E3327',
          700: '#2A4736',
          600: '#385F49',
          500: '#4A7C5F',
          400: '#649B7A',
          300: '#8BB89F',
          200: '#BCD6C7',
          100: '#E1ECE5',
          50: '#F3F7F5',
        },
        savanna: {
          gold: '#D4AF37',
          sand: '#D4B996',
          sandLight: '#E8D8C4',
          earth: '#8B5E3C',
          bark: '#4A3728',
          bone: '#F4F6F0',
        },
        safari: {
          accent: '#234F2D',
          emerald: '#1B4332',
          olive: '#556B2F',
          warning: '#D97706',
          danger: '#DC2626',
          success: '#059669',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      backgroundImage: {
        'topo-pattern': "radial-gradient(circle at 50% 50%, rgba(35, 79, 45, 0.08) 0%, transparent 60%)",
        'hero-gradient': "linear-gradient(to bottom, rgba(15, 26, 19, 0.75), rgba(7, 13, 9, 0.95))",
        'card-gradient': "linear-gradient(135deg, rgba(21, 36, 27, 0.7) 0%, rgba(15, 26, 19, 0.9) 100%)",
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        scan: {
          '0%, 100%': { top: '0%' },
          '50%': { top: '100%' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
