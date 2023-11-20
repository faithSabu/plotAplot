/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        rubberBand: {
          from: {
            transform: "scale3d(1,1,1)",
          },
          "30%": {
            transform: "scale3d(1.25,0.75,1)",
          },
          "40%": {
            transform: "scale3d(0.75,1.25,1)",
          },
          "50%": {
            transform: "scale3d(1.15,0.85,1)",
          },
          "65%": {
            transform: "scale3d(0.95,1.05,1)",
          },
          "75%": {
            transform: "scale3d(1.05,.095,1)",
          },
          to: {
            transform: "scale3d(1,1,1)",
          },
        },
        wave: {
          "0%": { transform: "rotate(0.0deg)" },
          "10%": { transform: "rotate(14deg)" },
          "20%": { transform: "rotate(-8deg)" },
          "30%": { transform: "rotate(14deg)" },
          "40%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(10.0deg)" },
          "60%": { transform: "rotate(0.0deg)" },
          "100%": { transform: "rotate(0.0deg)" },
        },
        slideIn: {
          "0%": {
            transform: "translateY(-5vh)",
            opacity: 0,
          },
          to: {
            transform: "translateY(0)",
            opacity: 1,
          },
        },
      },
      animation: {
        rubberBand: "rubberBand 1s infinite",
        "waving-hand": "wave 2s linear infinite",
        slideIn: "slideIn .5s ease-in-out ",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
