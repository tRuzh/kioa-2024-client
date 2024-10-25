import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8081,
  },
  build: {
    outDir: 'build',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
