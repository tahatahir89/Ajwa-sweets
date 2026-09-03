/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./context/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Palette derived from the Ajwa Sweets & Bakers logo: deep navy field,
        // white line-art, with a warm gold accent added for a premium feel.
        ajwa: {
          navy: "#101E44",
          navydark: "#0A1530",
          navylight: "#1F3A78",
          gold: "#C6A15B",
          golddark: "#A5842F",
          cream: "#FBF7EF",
          softcream: "#F3ECDD",
          ink: "#171A26",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(16, 30, 68, 0.35)",
        card: "0 4px 20px -6px rgba(16, 30, 68, 0.14)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(4deg)" },
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        fadeUp: "fadeUp 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};
