module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#f5eee4',
        'thai-dark': '#23312d',
        'thai-teal': '#0d6554',
        'thai-gold': '#c59b5a',
        'thai-warm': '#d8b192',
        'thai-muted': '#836a55'
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        ui: ['Inter', 'Noto Sans SC', 'sans-serif']
      }
    }
  },
  plugins: [],
}
