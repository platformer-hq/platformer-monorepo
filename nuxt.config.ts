// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: process.env.PROJECT === 'admin-panel'
    ? ['./apps/admin-panel']
    : ['./apps/launcher'],
});
