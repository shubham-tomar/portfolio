/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './**/*.html',
    './js/**/*.js',
    './components/**/*.html'
  ],
  darkMode: 'class', // This enables the class-based dark mode
  theme: {
    extend: {
      colors: {
        // Custom dark mode colors
        darkbg: '#0c0c0c',
        darksecondary: '#8880e8', // Your custom purple color
        darktext: '#f9fafb',
        darktextsecondary: '#d1d5db',
        darkaccent: '#3b82f6',
        darkborder: '#374151'
      }
    }
  },
  plugins: [],
}
