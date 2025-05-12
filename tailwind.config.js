/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Added app directory
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // Kept pages in case of mixed use
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Standard components folder
    "./providers/**/*.{js,ts,jsx,tsx,mdx}" // Added providers folder as it contains JSX
  ],
  theme: {
    extend: {
      colors: {
        light: {
          text: '#1a2b36', // Darker text for better contrast
          subtext: '#455a64', // Slightly darker subtext
          background: '#ffffff',
          accent: '#6ad7b7',
          accentHover: '#4bbd9b',
          border: '#e0e7eb' // Slightly darker border for better contrast
        },
        dark: {
          text: '#ffffff',
          subtext: '#b8c6c9',
          background: '#121a1d',
          accent: '#6ad7b7',
          accentHover: '#4bbd9b',
          border: '#232b2f'
        }
      }
    },
  },
  plugins: [],
}

