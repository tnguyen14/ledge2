import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  publicDir: '../static',
  envDir: '../',
  root: 'src',
  build: {
    outDir: '../dist'
  },
  server: {
    host: '0.0.0.0'
  },
  base: mode === 'production' ? '/ledge/' : '/'
}));
