import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Only use /usftt/ base path in production builds, not in dev/test
  base: mode === 'production' ? '/usftt/' : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // CSV files are copied to public/backend by the predev script
  // and will be served automatically by Vite at /backend/*
}))
