import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  define: {
    global: 'globalThis',
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        // Don't code-split Supabase - keep it in main bundle to avoid initialization issues
        manualChunks: undefined,
      },
      external: [],
    },
  },
  optimizeDeps: {
    include: ['@supabase/supabase-js'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  resolve: {
    alias: {
      // Ensure proper resolution
      '@supabase/supabase-js': '@supabase/supabase-js',
    },
    dedupe: ['@supabase/supabase-js'],
  },
  ssr: {
    noExternal: ['@supabase/supabase-js'],
  },
})
