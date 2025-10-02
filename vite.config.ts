import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  },
  preview: {
    port: 5173
  },
  build: {
    sourcemap: true
  },
  resolve: {
    alias: {
      '@/components': '/src/components',
      '@/pages': '/src/pages',
      '@/lib': '/src/lib'
    }
  }
});


