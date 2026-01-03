import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-08-07',
  devtools: {
    enabled: false
  },
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