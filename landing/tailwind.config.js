/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './en/index.html'],
  theme: {
    extend: {
      colors: {
        dark:    '#0D0F14',
        light:   '#ECEDEF',
        accent:  '#E8722A',
        'accent-hover': '#D4620A',
        'text-primary-dark':   '#F2F3F5',
        'text-secondary-dark': '#9BA1AB',
        'text-primary-light':  '#15171C',
        'text-secondary-light':'#5A5F68',
      },
      fontFamily: {
        sans:    ['"Wix Madefor Display"', 'system-ui', 'sans-serif'],
        display: ['"Unbounded"', '"Wix Madefor Display"', 'system-ui', 'sans-serif'],
      },
    }
  },
  plugins: [],
}
