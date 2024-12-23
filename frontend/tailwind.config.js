/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xxs: "390px", // New screen size for extra small devices

      xss: "400px", // Your already defined custom screen

      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      xxl: "1440px",
    },
    extend: {
      colors: {
        fontColor: '#535353', // Custom font color
        backgroundColor: '#f8f8f8', // Custom background color
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'], // Custom font family
      },
    },
  },
  plugins: [],
};
