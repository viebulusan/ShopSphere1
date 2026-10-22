/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#1D4533',
          dark: '#143224',
          light: '#2B5E47',
        },
        linen: {
          DEFAULT: '#F7EAE0',
          dark: '#ECE0D5',
          light: '#FAF4EE',
        },
        peach: {
          DEFAULT: '#F9D2BA',
          dark: '#E8B99B',
          light: '#FCE7D8',
        },
        terracotta: {
          DEFAULT: '#5E3122',
          dark: '#472418',
          light: '#834733',
        },
        // Aliases for compatibility
        canvas: {
          DEFAULT: '#F7EAE0',
          light: '#FFFFFF',
          dark: '#ECE0D5',
        },
        charcoal: {
          DEFAULT: '#1D4533',
          dark: '#143224',
          light: '#2B5E47',
        },
        midnight: {
          DEFAULT: '#1D4533',
          dark: '#143224',
          light: '#2B5E47',
        },
        spruce: {
          DEFAULT: '#1D4533',
          dark: '#143224',
          light: '#2B5E47',
        },
        teal: {
          DEFAULT: '#1D4533',
          dark: '#143224',
          light: '#2B5E47',
        },
        jade: {
          DEFAULT: '#5E3122',
          dark: '#472418',
          light: '#834733',
        },
        sage: {
          DEFAULT: '#F9D2BA',
          dark: '#E8B99B',
          light: '#FCE7D8',
        },
        blush: {
          DEFAULT: '#F7EAE0',
          dark: '#ECE0D5',
          light: '#FFFFFF',
        },
        rose: {
          DEFAULT: '#F9D2BA',
          dark: '#E8B99B',
          light: '#FCE7D8',
        },
        mauve: {
          DEFAULT: '#5E3122',
          dark: '#472418',
          light: '#834733',
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
        'xs': '0 1px 3px rgba(29, 69, 51, 0.04)',
        'apple': '0 4px 20px -2px rgba(29, 69, 51, 0.08)',
        'apple-hover': '0 12px 28px -4px rgba(29, 69, 51, 0.14)',
        'apple-lg': '0 16px 36px -6px rgba(29, 69, 51, 0.18)',
        'nav': '0 10px 30px -5px rgba(29, 69, 51, 0.15)',
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
