export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: ['@pinia/nuxt'],

  css: ['~/assets/css/main.css'],

  nitro: {
    preset: 'node-server'
  },

  app: {
    head: {
      title: 'Gestión de Tareas — Erick J.',
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
      link: [{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
             { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' }]
    }
  },

  runtimeConfig: {
    public: {
      apiUrl: '',
      authToken: 'token-secreto-sorah'
    }
  },

  components: [
    { path: '~/components', pathPrefix: false }
  ]
})