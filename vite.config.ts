import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Generate source maps for production debugging
    sourcemap: true,
    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          chakra: ['@chakra-ui/react', '@emotion/react', '@emotion/styled'],
          icons: ['react-icons'],
          motion: ['framer-motion'],
        },
      },
    },
    // Optimize bundle size
    chunkSizeWarningLimit: 1000,
    // Minification
    minify: 'terser',
  },
  // Development server configuration
  server: {
    port: 5173,
    host: true,
    cors: true,
  },
  // Preview server configuration
  preview: {
    port: 4173,
    host: true,
  },
  // Resolve configuration
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  // Environment variables
  envPrefix: 'VITE_',
});
