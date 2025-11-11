import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#007AFF',
          light: '#5AC8FA',
          dark: '#0055B8',
        },
      },
      borderRadius: {
        xl: '14px',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
