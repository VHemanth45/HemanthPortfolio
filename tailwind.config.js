/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'brand': {
                    900: '#0f172a', // Slate 900
                    800: '#1e293b', // Slate 800
                    500: '#06b6d4', // Cyan 500 (AI accent)
                    400: '#22d3ee', // Cyan 400
                }
            }
        },
    },
    plugins: [],
}
