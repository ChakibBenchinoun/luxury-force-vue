// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'nitro-cloudflare-dev',
    'nuxt-module-eslint-config',
    'shadcn-nuxt',
    'nuxt-icon',
  ],
  nitro: {
    preset: 'cloudflare-pages',
  },
})
