/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F5F1E8",
          50: "#FAF8F3",
          100: "#F5F1E8",
          200: "#E8DFC8",
          300: "#DBCDA8",
        },
        charcoal: {
          DEFAULT: "#202020",
          50: "#4A4A4A",
          100: "#363636",
          200: "#2B2B2B",
          300: "#202020",
          900: "#141414",
        },
        olive: {
          DEFAULT: "#777B55",
          50: "#F2F3EC",
          100: "#DEE1CE",
          200: "#B8BD99",
          300: "#989E70",
          400: "#777B55",
          500: "#5B5F3E",
          600: "#474B2F",
        },
        vintage: {
          brown: "#9B795B",
          rust: "#B35A38",
          sand: "#DFD7CA",
        },
        "light-grey": "#E9E7E1",
        "soft-white": "#FFFFFF",
      },
      fontFamily: {
        sans: ["'Inter'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        display: ["'Space Grotesk'", "'Inter'", "-apple-system", "sans-serif"],
        editorial: ["Georgia", "serif"],
      },
      letterSpacing: {
        tighter: "-0.05em",
        tight: "-0.025em",
        wide: "0.05em",
        wider: "0.1em",
        widest: "0.2em",
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
