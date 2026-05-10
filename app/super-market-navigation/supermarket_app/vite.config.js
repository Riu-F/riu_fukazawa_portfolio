import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Static bundle for embedding in the Next.js case study (iframe src).
const outDir = path.resolve(__dirname, '../../../public/super-market-navigation/foodhub');

export default defineConfig({
  plugins: [react()],
  base: '/super-market-navigation/foodhub/',
  build: {
    outDir,
    emptyOutDir: true,
  },
});
