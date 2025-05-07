import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

// src/config.js
export const SERVER_URL = `${window.location.protocol}//${window.location.hostname}:7777`;
