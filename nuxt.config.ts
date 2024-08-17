export default defineNuxtConfig({
  components: {
    global: true,
    dirs: ["~/components"],
  },

  devtools: { enabled: true },
  css: ["@/assets/css/main.css"],

  modules: [
    "@nuxt/ui",
    "nuxt-typed-router",
    "nuxt-viewport",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "nuxt-vuefire",
  ],

  pinia: {
    storesDirs: ["./stores/**", "./custom-folder/stores/**"],
  },

  ui: {
    icons: ["heroicons"],
    safelistColors: ["primary", "secondary"],
  },

  piniaPersistedstate: {
    cookieOptions: {
      sameSite: "strict",
    },
    storage: "localStorage",
  },

  imports: {
    dirs: ["stores", "composables/**"],
  },

  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.BASE_URL,
      APP_TENANT: process.env.APP_TENANT,
      APP_GOOGLE_CLIENT_ID: process.env.APP_GOOGLE_CLIENT_ID,
      APP_CASHFREE_ENVIRONMENT: process.env.APP_CASHFREE_ENVIRONMENT,
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
      STORAGE_URL: process.env.STORAGE_URL,
    },
  },

  vuefire: {
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      appId: process.env.FIREBASE_APP_ID,
    },
  },

  colorMode: {
    preference: 'light'
  },

  plugins: [],
  compatibilityDate: "2024-07-07",
});