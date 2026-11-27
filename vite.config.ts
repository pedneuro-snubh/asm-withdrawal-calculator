import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from https://pedneuro-snubh.github.io/asm-withdrawal-calculator/
export default defineConfig({
  base: '/asm-withdrawal-calculator/',
  plugins: [react()],
});
