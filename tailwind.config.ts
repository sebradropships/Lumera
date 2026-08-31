import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#FBF8F4",
        linen: "#F4EEE6",
        champagne: "#EADFD1",
        sand: "#DFCFBB",
        charcoal: "#211E1B",
        graphite: "#4A443E",
        muted: "#8A8079",
        gold: "#B08D57",
        goldsoft: "#D8BE93",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "Times New Roman", "serif"],
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      letterSpacing: {
        brand: "0.42em",
        eyebrow: "0.28em",
        wide2: "0.16em",
      },
      borderRadius: {
        xl2: "1.75rem",
        xl3: "2.25rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(33,30,27,0.04), 0 12px 40px -18px rgba(33,30,27,0.22)",
        lift: "0 2px 4px rgba(33,30,27,0.05), 0 24px 60px -24px rgba(33,30,27,0.30)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.7)",
      },
      transitionTimingFunction: {
        silk: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translate3d(0, 18px, 0)" },
          to: { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
        "slide-in": {
          from: { transform: "translate3d(100%, 0, 0)" },
          to: { transform: "translate3d(0, 0, 0)" },
        },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        shimmer: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(220%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
        "slide-in": "slide-in 0.42s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 0.3s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
