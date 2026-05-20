import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    middlewareMode: false,
    watch: {
      usePolling: true,
      interval: 50,
      binaryInterval: 100,
      ignored: ['**/node_modules/**', '**/.git/**'],
    },
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
      timeout: 60000,
    },
  },
})
