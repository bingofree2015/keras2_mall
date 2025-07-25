import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    server: {
        port: 3000,
        open: true,
        proxy: {
            '/cms': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                rewrite      : (path) => path.replace(/^\/cms/, '/cms'),
            },
        },
    },
});
