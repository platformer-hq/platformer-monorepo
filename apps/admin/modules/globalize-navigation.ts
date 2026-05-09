import { addComponent, addImports, defineNuxtModule } from '@nuxt/kit';

export default defineNuxtModule({
  setup() {
    addImports([
      'isPageReload',
      'useParsedQuery',
      'useNavigationDirection',
    ].map(name => ({ name, from: '@workspace/navigation' })));

    ['NavigationStateProvider'].forEach(name => {
      addComponent({ name, export: name, filePath: '@workspace/navigation' });
    });
  },
});
