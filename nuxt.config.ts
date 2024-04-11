import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    '@vite-pwa/nuxt'
  ],
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  }
})