import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Deployed as a GitHub Pages project site at https://knottx.dev/qr/
export default defineConfig({
  base: '/qr/',
  plugins: [react(), tailwindcss()],
  // Fixed ports so the VS Code debug configurations always find the server.
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
  build: {
    target: 'es2022',
  },
})
