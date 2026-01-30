import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'module_app',
      filename: 'remoteEntry.js',
      exposes: {
        './ModuleManagement': './src/components/module/ModuleManagement.vue'
      },
      shared: ['vue']
    })
  ],
  server: {
    port: 3001,
    open: false
  },
  build: {
    target: 'esnext'
  }
})