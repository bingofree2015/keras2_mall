import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [vue()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
            extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
        },
        server: {
            host: 'localhost',
            port: 8085,
            open: true,
            proxy: {
                '/cms': {
                    target: env.VITE_BASE_URL || 'http://127.0.0.1:8080',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/cms/, '/cms'),
                },
                '/upload': {
                    target: env.VITE_BASE_URL || 'http://127.0.0.1:8080',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/upload/, '/upload'),
                },
            },
        },
        build: {
            rollupOptions: {
                output: {
                    // 在构建时使用占位符
                    manualChunks: undefined,
                },
            },
            // 构建时替换环境变量为占位符
            define: {
                'import.meta.env.VITE_BASE_URL': JSON.stringify('VITE_BASE_URL_PLACEHOLDER'),
                'import.meta.env.VITE_APP_TITLE': JSON.stringify('VITE_APP_TITLE_PLACEHOLDER'),
            },
        },
    };
});
