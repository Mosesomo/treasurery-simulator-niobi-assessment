import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: [
      '.replit.dev',
      '.repl.co',
      'localhost',
      '127.0.0.1'
    ],
    host: '0.0.0.0',
    port: 3000,
    hmr: {
      clientPort: 443,
      host: process.env.REPL_SLUG + '.' + process.env.REPL_OWNER + '.repl.co'
    }
  }
})