import { defineConfig } from 'vite';

import postcss from "postcss";
import tailwindcss from 'tailwindcss';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        postcss(tailwindcss)
    ],
    base: '/delorealty-landing/'
});