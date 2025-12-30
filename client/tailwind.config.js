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
                    DEFAULT: '#000000', // Black
                    foreground: '#FFFFFF',
                },
                secondary: {
                    DEFAULT: '#FFFFFF', // White
                    foreground: '#000000',
                },
                accent: {
                    100: '#F3F4F6', // Gray 100
                    200: '#E5E7EB', // Gray 200
                    500: '#6B7280', // Gray 500
                    900: '#111827', // Gray 900
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
