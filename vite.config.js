import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 5173,
    strictPort: true,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      workbox: {
        // Allow caching of large LLM model files if they are part of precache (unlikely but safe)
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024 * 1024, 
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        // Import custom cleanup script
        importScripts: ['sw-cleanup.js'],
        // We explicitly remove HuggingFace runtimeCaching to let Transformers.js handle it
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cdn-cache',
              expiration: { maxEntries: 20 }
            }
          }
        ]
      },
      manifest: {
        name: 'Passhork',
        short_name: 'Passhork',
        description: 'AI-Assisted Memorable Password Generator',
        theme_color: '#6366f1',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'vite.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          },
          {
            src: 'mask-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
})
