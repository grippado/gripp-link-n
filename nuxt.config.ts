import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-08-07',
  devtools: {
    enabled: false
  },
  modules: [
    '@vite-pwa/nuxt'
  ],
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Gripp Link',
      short_name: 'Gripp Link',
      description: 'Personal links and tools',
      theme_color: '#4CAF50',
      background_color: '#4CAF50',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,jpg,jpeg,webp}'],
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB - aumenta limite para arquivos grandes
      globIgnores: [
        '**/vv1.jpeg', // 3MB - muito grande para precache
        '**/joint.png' // 3MB - muito grande para precache
      ]
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 20
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module'
    }
  } as any,
  vite: {
    server: {
      watch: {
        ignored: (path: string) => {
          return path.includes('/lambda/') || path.includes('\\lambda\\')
        }
      }
    }
  },
  nitro: {
    ignore: [
      'lambda/**'
    ]
  },
  runtimeConfig: {
    public: {
      jointCountApiUrl: 'https://zx8085f2yg.execute-api.us-east-1.amazonaws.com/dev',
      // Password for incrementing joint count (JOINT_COUNT_PASSWORD)
      jointCountPassword: process.env.JOINT_COUNT_PASSWORD || 'gripp2026!',
      // Default password for page authentication (GRIPP_LINK_DEFAULT_PASSWD)
      defaultPassword: process.env.GRIPP_LINK_DEFAULT_PASSWD || 'gripp2026!'
    }
  },
  app: {
    head: {
      script: [
        {
          hid: 'gtm-head-script',
          innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                      })(window,document,'script','dataLayer','GTM-N3H5KRZ');`
        }
      ]
    }
  }
})