/** @type {import('tailwindcss').Config} */
module.exports = { // Keeping module.exports to match your existing setup
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Ensure this path is correct for your project structure
  ],
  theme: {
    extend: {
      colors: {
        // --- Jisefi Brand Colors ---
        'jisefi-green-dark': '#0A4C40',      
        'jisefi-green-light': '#367C2B',     // Lighter green for accents/hovers
        'jisefi-yellow-accent': '#FFD700',   // Bright yellow for accents/warnings
        'jisefi-red-flag': '#DC2626',        // Specific red for "red flag" type/errors
        'jisefi-dark-grey': '#334155',       // Darker grey for text/icons
        'jisefi-light-grey': '#CBD5E1',      // Lighter grey for borders/dividers
        'jisefi-off-white': '#F8FAFC',       // Very light background for overall page

        // You can keep or remove the default Tailwind palettes below if you still use them.
        // For Jisefi design, you generally want to use the 'jisefi-' prefixed colors.
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
        },
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
        },
      },
      boxShadow: {
        'light': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'medium': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'strong': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      fontFamily: {
        // Ensure 'Inter' is defined if you're using it and importing it via Google Fonts in index.html
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Keeping your forms plugin
  ],
};