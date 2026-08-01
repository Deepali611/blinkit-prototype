import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blinkit: {
          yellow: "#F8CB45",
          "yellow-dark": "#E5B834",
          green: "#54B226",
          "green-dark": "#43961C",
          "green-light": "#EAF7E6",
          black: "#1F1F1F",
          muted: "#666666",
          light: "#F4F6FB",
          card: "#FFFFFF",
          border: "#E5E7EB",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
