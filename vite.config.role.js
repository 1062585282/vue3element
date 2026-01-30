import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'role_app',
      filename: 'remoteEntry.js',
      exposes: {
        './RoleManagement': './src/components/role/RoleManagement.vue'
      },
      shared: ['vue']
    })
  ],
  server: {
    port: 3003,
    open: false
  },
  build: {
    target: 'esnext'
  }
})