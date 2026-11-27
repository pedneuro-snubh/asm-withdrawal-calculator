import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from https://pedneuro-snubh.github.io/asm-withdrawal/
export default defineConfig({
  base: '/asm-withdrawal/',
  plugins: [react()],
});
