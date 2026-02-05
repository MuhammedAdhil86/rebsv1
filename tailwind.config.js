/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      // Fonts
      fontFamily: {
        sans: ["Poppins", "Helvetica", "Arial", "sans-serif"],
      },
      // Font weights
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      // Animations
      keyframes: {
        slide: {
          "0%": { transform: "translateX(-50%)" },
          "50%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        slide: "slide 4s linear infinite",
      },
    },
  },
  plugins: [
    function ({ addBase, theme }) {
      const fontSans = theme("fontFamily.sans");

      addBase({
        html: {
          fontFamily: Array.isArray(fontSans) ? fontSans.join(", ") : fontSans,
          fontWeight: "400",
        },
        body: {
          fontWeight: "400",
        },
        "input::placeholder, textarea::placeholder": {
          fontFamily: Array.isArray(fontSans) ? fontSans.join(", ") : fontSans,
          fontWeight: "400",
        },
      });
    },
  ],
};
