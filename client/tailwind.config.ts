import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'bottom': '0 1px 20px -10px  rgb(10,100,100)',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'fade-in':' pulse 0.8s linear'
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    require("tailwindcss-animation-delay"),
    // ...
  ]
}
export default config
