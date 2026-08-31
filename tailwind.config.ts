import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blush: "#FFF7F9", // page ground
        petal: "#FDEFF3", // soft section fill
        babypink: "#F9D6E1", // accent fill
        rosedust: "#EFC3D0", // hairlines and borders
        ink: "#2B1F24", // headings
        plum: "#574450", // body copy
        muted: "#7E6A72", // secondary copy (5:1 on blush)
        pink: "#C2456B", // primary accent + CTA (5.3:1 with white)
        pinksoft: "#F0A8BE", // decorative accent
      },
      fontFamily: {
        // Gilroy when the licensed files are present in public/fonts/,
        // otherwise Outfit — the closest free geometric sans.
        sans: ["Gilroy", "var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        serif: ["Gilroy", "var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
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
        soft: "0 1px 2px rgba(43,31,36,0.05), 0 12px 40px -18px rgba(43,31,36,0.20)",
        lift: "0 2px 4px rgba(43,31,36,0.06), 0 24px 60px -24px rgba(43,31,36,0.26)",
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
