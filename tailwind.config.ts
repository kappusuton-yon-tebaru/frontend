import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        //For modal
        "ci-modal-white": "#F2F9FF",
        "ci-modal-black": "#161F3A",
        "ci-modal-blue": "#245FA1",
        "ci-modal-timmid-blue": "#274A87",
        "ci-modal-light-blue": "#006DF5",
        "ci-modal-cyan-blue": "#4691A9",
        "ci-modal-grey": "#999999",
        "ci-modal-red": "#AB3030",
        "ci-modal-dark-blue": "#081026",

        //For background
        "ci-bg-dark-blue": "#1A335F",
        "ci-bg-blur-white": "#CDCDCD",

        //For service status
        "ci-status-green": "#ADFF89",
        "ci-status-yellow": "#FFCC89",
        "ci-status-red": "#FF8989",
      },
    },
  },
  plugins: [],
  safelist: ["inline-block"],
} satisfies Config;
