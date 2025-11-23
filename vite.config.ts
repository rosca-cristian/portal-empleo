import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Excluir archivos de test del build de producción
      external: (id) => {
        return id.includes('.test.') || id.includes('.spec.')
      }
    }
  }
})
