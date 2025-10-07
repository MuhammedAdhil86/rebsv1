/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [
    function ({ addBase, theme }) {
      const fontSans = theme('fontFamily.sans');
      addBase({
        '::placeholder': {
          fontFamily: Array.isArray(fontSans) ? fontSans.join(', ') : fontSans, // ✅ safe fix
        },
      });
    },
  ],
};
