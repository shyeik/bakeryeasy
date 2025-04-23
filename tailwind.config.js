/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // Or your main entry point file
    "./src/**/*.{js,ts,jsx,tsx}", // Include all your component files
  ],
  theme: {
    extend: {
      perspective: {
        DEFAULT: "1000px",
      },
      colors: {
        primary: "#FF2D55",
        secondary: "#FFEFEF",
      },
      fontFamily: {
        Roboto: ["Roboto", "sans-serif"],
        australia: ["Edu AU VIC WA NT Dots", "cursive"],
        cake: ['"Great Vibes"', "cursive"],
      },
    },
  },
  plugins: [],
};
