import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for Child Portal
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
