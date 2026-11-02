/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        screen: "100dvh",
      },
      colors: {
        primary: "#2A3A5A",
        secondary: "#14192d",
      },
      // fontFamily: {
      //   sans: ['Roboto Mono', 'monospace'],
      // },
    },
  },
  plugins: [],
  experimental: {
    classRegex: ["clsx\\(([^)]*)\\)", "classnames\\(([^)]*)\\)"],
  },
};
