import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/contracts': 'http://localhost:8000',
      '/reviewer': 'http://localhost:8000',
    }
  }
})