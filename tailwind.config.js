/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}",
  ],
  theme: {
    extend: {
      colors: {
        palette: {
          50: '#f9f6f1',
          100: '#efe8de',
          200: '#efe8de',
          300: '#d21624',
          400: '#1664b0',
          500: '#1664b0',
          600: '#0f4880',
          700: '#0a335c',
          800: '#1A1D20',
          900: '#0e1012',
        },
        forest: {
          DEFAULT: '#1664b0',
          dark: '#0f4880',
          light: '#2a7cd0',
        },
        linen: {
          DEFAULT: '#FFFFFF',
          dark: '#efe8de',
          light: '#fbf8f3',
        },
        peach: {
          DEFAULT: '#d21624',
          dark: '#a9121d',
          light: '#e03946',
        },
        terracotta: {
          DEFAULT: '#1664b0',
          dark: '#0f4880',
          light: '#d21624',
        },
        canvas: {
          DEFAULT: '#efe8de',
          light: '#FFFFFF',
          dark: '#efe8de',
        },
        charcoal: {
          DEFAULT: '#1A1D20',
          dark: '#0e1012',
          light: '#555B62',
        },
        midnight: {
          DEFAULT: '#1664b0',
          dark: '#0f4880',
          light: '#2a7cd0',
        },
        spruce: {
          DEFAULT: '#1664b0',
          dark: '#0f4880',
          light: '#2a7cd0',
        },
        teal: {
          DEFAULT: '#1664b0',
          dark: '#0f4880',
          light: '#2a7cd0',
        },
        jade: {
          DEFAULT: '#d21624',
          dark: '#a9121d',
          light: '#e03946',
        },
        sage: {
          DEFAULT: '#efe8de',
          dark: '#1664b0',
          light: '#fbf8f3',
        },
        blush: {
          DEFAULT: '#efe8de',
          dark: '#d21624',
          light: '#fbf8f3',
        },
        rose: {
          DEFAULT: '#d21624',
          dark: '#a9121d',
          light: '#e03946',
        },
        mauve: {
          DEFAULT: '#1664b0',
          dark: '#0f4880',
          light: '#efe8de',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          '"Plus Jakarta Sans"',
          'system-ui',
          'sans-serif',
        ],
      },
      boxShadow: {
        'xs': '0 1px 3px rgba(22, 100, 176, 0.08)',
        'apple': '0 4px 18px -2px rgba(22, 100, 176, 0.08)',
        'apple-hover': '0 10px 26px -4px rgba(22, 100, 176, 0.16)',
        'apple-lg': '0 16px 36px -6px rgba(22, 100, 176, 0.18)',
        'nav': '0 10px 30px -5px rgba(22, 100, 176, 0.12)',
      },
      borderRadius: {
        'squircle': '24px',
        'squircle-sm': '16px',
        'squircle-lg': '32px',
      },
    },
  },
  plugins: [],
};
