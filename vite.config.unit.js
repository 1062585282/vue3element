import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'unit_app',
      filename: 'remoteEntry.js',
      exposes: {
        './StaffManagement': './src/components/unit/StaffManagement.vue',
        './FormDesign': './src/components/unit/FormDesign.vue'
      },
      shared: ['vue']
    })
  ],
  server: {
    port: 3004,
    open: false
  },
  build: {
    target: 'esnext'
  }
})