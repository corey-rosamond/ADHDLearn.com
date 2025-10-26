import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for Parent Portal
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
