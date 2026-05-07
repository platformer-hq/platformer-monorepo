import { addImports, defineNuxtModule } from '@nuxt/kit';

export default defineNuxtModule({
  setup() {
    addImports([
      'camelToKebab',
      'createProvider',
      'formatNumber',
      'throwify',
      'throwifyAnyEither',
    ].map(name => ({ name, from: '@workspace/utils' })));
  },
});
