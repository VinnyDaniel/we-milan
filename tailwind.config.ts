import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#181A31',
        navy: {
          DEFAULT: '#272A4B',
          2: '#333866',
          3: '#3E437A',
        },
        coral: {
          DEFAULT: '#E44C4E',
          dim: '#B93A3C',
        },
        gold: {
          DEFAULT: '#CCA166',
          light: '#E2C78C',
        },
        cream: '#F2ECDD',
        muted: '#9C9FBE',
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        cursive: ['Pacifico', 'cursive'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        marquee: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.25s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
