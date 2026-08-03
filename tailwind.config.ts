import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        charcoal: "#161514",
        bone: "#FAF8F4",
        gold: {
          DEFAULT: "#C6A15B",
          light: "#E9D9B4",
          dark: "#96793F"
        },
        smoke: "#8A867C"
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-inter)", "sans-serif"]
      },
      letterSpacing: {
        widest2: "0.22em"
      },
      keyframes: {
        fadeUp: { "0%": { opacity: "0", transform: "translateY(16px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } }
      },
      animation: {
        fadeUp: "fadeUp .8s ease forwards",
        shimmer: "shimmer 2.5s linear infinite"
      }
    }
  },
  plugins: []
};
export default config;
