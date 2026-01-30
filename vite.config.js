import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'host_app',
      remotes: {
        module_app: 'module_app@http://localhost:3001/assets/remoteEntry.js',
        menu_app: 'menu_app@http://localhost:3002/assets/remoteEntry.js',
        role_app: 'role_app@http://localhost:3003/assets/remoteEntry.js',
        unit_app: 'unit_app@http://localhost:3004/assets/remoteEntry.js'
      },
      shared: ['vue']
    })
  ],
  server: {
    port: 3000,
    open: true
  },
  build: {
    target: 'esnext'
  },
  optimizeDeps: {
    exclude: [
      'module_app',
      'menu_app',
      'role_app',
      'unit_app'
    ]
  }
})
