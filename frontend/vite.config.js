import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

export default defineConfig(() => {
  return {
    server: {
      open: true,
    },
    define: {
      'process.env': {},
    },
    build: {
      outDir: 'build',
    },
    plugins: [react()],
  };
});
