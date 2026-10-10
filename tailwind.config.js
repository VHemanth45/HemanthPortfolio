/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Lab-notebook paper and ink.
                paper: {
                    DEFAULT: '#f4f1e9',
                    deep: '#ebe6da',
                    card: '#fbfaf6',
                },
                ink: {
                    DEFAULT: '#17150f',
                    2: '#55514a', // body copy — 7:1 on paper
                    3: '#6d685e', // labels — 4.9:1 on paper
                    4: '#a39d90', // decorative strokes only, never text
                },
                rule: '#d8d2c4',
                // matplotlib's tab10 — the only colours on the page. Strokes, fills, large type.
                plot: {
                    blue: '#1f77b4',
                    orange: '#ff7f0e',
                    green: '#2ca02c',
                    red: '#d62728',
                    purple: '#9467bd',
                },
                // The same hues darkened to ≥4.5:1 on paper, for small text.
                pen: {
                    blue: '#19659a',
                    orange: '#a85400',
                    green: '#1f7a1f',
                    red: '#b8201f',
                    purple: '#7a4fa3',
                },
            },
            fontFamily: {
                serif: ['"Instrument Serif"', 'ui-serif', 'Georgia', 'serif'],
                sans: ['"Geist Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                mono: ['"Geist Mono Variable"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
                hand: ['Kalam', '"Comic Sans MS"', 'cursive'],
            },
            letterSpacing: {
                label: '0.16em',
            },
            maxWidth: {
                page: '78rem',
            },
        },
    },
    plugins: [],
}
