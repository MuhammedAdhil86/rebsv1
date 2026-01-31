/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "Helvetica", "Arial", "sans-serif"],
      },
      fontWeight: {
        normal: "400",
        medium: "400",
        semibold: "400",
        bold: "400",
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
        "::placeholder": {
          fontFamily: Array.isArray(fontSans) ? fontSans.join(", ") : fontSans,
          fontWeight: "400",
        },
      });
    },
  ],
};
