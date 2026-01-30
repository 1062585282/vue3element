import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'menu_app',
      filename: 'remoteEntry.js',
      exposes: {
        './MenuManagement': './src/components/menu/MenuManagement.vue'
      },
      shared: ['vue']
    })
  ],
  server: {
    port: 3002,
    open: false
  },
  build: {
    target: 'esnext'
  }
})