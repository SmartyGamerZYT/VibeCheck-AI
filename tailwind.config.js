/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#FAF8F5',
          100: '#F5F1E8',
          200: '#EAE3D2',
          300: '#D8CCB5',
          400: '#BEAC8E',
          500: '#9C8561',
          600: '#7B6745',
          700: '#5A4A30',
          800: '#3D3220',
          900: '#231B10',
          950: '#140F08',
        },
        ink: {
          DEFAULT: '#191612',
          muted: '#686156',
          faint: '#9E978C',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(35, 27, 16, 0.05), 0 4px 6px -2px rgba(35, 27, 16, 0.02)',
        'card': '0 4px 20px -2px rgba(35, 27, 16, 0.07)',
        'modal': '0 20px 40px -15px rgba(35, 27, 16, 0.2)',
      }
    },
  },
  plugins: [],
}

