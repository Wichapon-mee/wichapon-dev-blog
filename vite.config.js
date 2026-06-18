import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev
export default defineConfig({
  plugins: [react()],
})
