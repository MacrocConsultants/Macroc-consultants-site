import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        theme: {
          bg: "var(--theme-bg)",
          fg: "var(--theme-fg)",
          primary: "var(--theme-primary)",
          card: "var(--theme-card)",
          border: "var(--theme-border)",
        },
      },
    },
  },
  plugins: [],
}
export default config
