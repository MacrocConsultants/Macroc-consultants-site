module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        macrocGreen: '#0f8a5f',
        macrocGold: '#d4af37'
      },
      backgroundImage: {
        'team': "url('/team-accounting-bg.jpg.png')",
      },
    },
  },
  plugins: [],
}
