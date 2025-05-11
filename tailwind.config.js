/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Added app directory
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // Kept pages in case of mixed use
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Standard components folder
    "./providers/**/*.{js,ts,jsx,tsx,mdx}" // Added providers folder as it contains JSX
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

