/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        main: "#3f6449",
        login: "#093623",
        loginAccent: "#1e5724",
        mainLight: "#f8f4e4",

      },
      fontFamily: {
        Fraunces: ["Fraunces"], 
      },
      screens: {
        mobileS: "320px",
        mobileM: "375px",
        mobileL: "420px",
        tablet: "768px",
        laptop: "1024px", 
        desktop: "1280px",
        laptopL: "1440px",
        fourk: "2560px",
      },
      boxShadow: {
        main: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [],
}

