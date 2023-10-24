import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export const content = [
  './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
  './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  './src/app/**/*.{js,ts,jsx,tsx,mdx}',
];
export const theme = {
  extend: {
    backgroundImage: {
      'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
    },
    colors: {
      primary: '#333F69',
      secondary: '#667dd1',
      ghost: '#ECEFFA',
      lavander: '#D9DFF4',
      yield: '#E0BA3F',
    },
    fontFamily: {
      sans: ['Roboto', ...defaultTheme.fontFamily.sans],
      russo: ['var(--font-russo-one)', defaultTheme.fontFamily.sans],
    },
    screens: {
      '2xs': '325px',
      // => @media (min-width: 320px) { ... }
    },
    keyframes: {
      text: {
        '0%, 100%': {
          'background-size': '200% 200%',
          'background-position': 'left center',
        },
        '50%': {
          'background-size': '200% 200%',
          'background-position': 'right center',
        },
      },
      typing: { '0%': { width: '0%', visibility: 'hidden' }, '100%': { width: '100%' } },
      blink: { '50%': { borderColor: 'transparent' }, '100%': { borderColor: 'white' } },
    },
    animation: {
      typing: 'typing 2s steps(20) infinite alternate, blink .7s infinite',
      text: 'text 5s ease infinite',
      'spin-slow': 'spin 1.8s linear infinite',
    },
  },
};
export const plugins = [];
