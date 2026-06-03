/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6', // blue-500
          dark: '#2563eb',   // blue-600
        },
        secondary: {
          DEFAULT: '#10b981', // emerald-500
          dark: '#059669',   // emerald-600
        },
        dark: '#1f2937',     // gray-800
        light: '#f3f4f6',    // gray-100
      },
    },
  },
  plugins: [],
}
