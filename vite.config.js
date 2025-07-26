import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs';

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    // https: {
    //   key: fs.readFileSync('localhost-key.pem'),
    //   cert: fs.readFileSync('localhost.pem')
    // },
    host: '0.0.0.0', // Allow external access
    port: 5000, // Run Vite on port 3000
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: [
      'smartbus360.com',
      'www.smartbus360.com',
      'http://smartbus360.com',
      'http://www.smartbus360.com',
      'https://smartbus360.com',
      'https://www.smartbus360.com',
      'admin.smartbus360.com',
      'https://admin.smartbus360.com',
      'https://www.admin.smartbus360.com',
      'http://localhost:3000/',
      'https://backend.smartbus360.com/api',
    ]
  }
})
