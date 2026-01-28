import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

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
  // Serve backend CSV files during development
  server: {
    middlewareMode: false,
    fs: {
      strict: false,
    },
    proxy: {},
    // Use middleware to serve backend CSV files
    configure(app) {
      app.use('/backend', (req, res, next) => {
        const filePath = path.join(__dirname, 'backend', req.url)
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          res.setHeader('Content-Type', 'text/csv')
          fs.createReadStream(filePath).pipe(res)
        } else {
          next()
        }
      })
    },
  },
}))
