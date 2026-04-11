import { miniApp } from '@tma.js/sdk-vue';

export default defineNuxtPlugin({
  name: 'readiness',
  setup(nuxtApp) {
    let isFirstMount = true;

    nuxtApp.hook('page:finish', () => {
      if (isFirstMount) {
        miniApp.ready();
        isFirstMount = false;
      }
    });
  },
});
