module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "android-phone": "url('./assets/pixel3xl.webp')",
      },
      animation:{
        'spin':'spin 1s linear infinite',
      }
    },
  },
  plugins: [],
}