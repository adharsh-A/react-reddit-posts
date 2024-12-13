import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  css: {
    postcss: "./postcss.config.js", // Ensure this file exists and is configured correctly
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // fix here
      "@components": path.resolve(__dirname, "./src/components"),
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
    
  },
  plugins: [react()],
})
