/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './*.php',
        './template-parts/**/*.php',
        './woocommerce/**/*.php',
        './assets/js/**/*.js',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#32598f',
                'primary-hover': '#274a7c',
            },
            fontFamily: {
                display: ['Playfair Display', 'Georgia', 'serif'],
                body: ['Source Serif 4', 'Georgia', 'serif'],
            },
            borderRadius: {
                DEFAULT: '16px',
                sm: '16px',
                md: '16px',
                lg: '16px',
                xl: '16px',
                '2xl': '16px',
            },
            transitionTimingFunction: {
                smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
                spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            },
        },
    },
    plugins: [],
};
