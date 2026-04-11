import { addComponent, addImports, defineNuxtModule } from '@nuxt/kit';

export default defineNuxtModule({
  setup() {
    addImports([
      'bem',
      'createListItemTransition',
      'createReversibleTransition',
      'reverseTransitionKeyframesIfLeave',
      'toPx',
      'bem',
    ].map(name => ({ name, from: '@tma.js/vue-kit' })));

    [
      'BottomBar',
      'BottomBarInner',
      'BottomBarTransition',
      'ButtonAndroid',
      'ButtonBase',
      'ButtonIos',
      'LoadingIndicatorAndroid',
      'LoadingIndicatorIos',
      'PagePaddings',
      'ProgressiveImage',
      'ProgressiveImageElement',
      'ProgressiveImagePlaceholder',
      'ProgressiveImageShimmer',
      'ProgressiveImageTransition',
      'SidePaddings',
      'VerticalPaddings',
    ].forEach(name => {
      addComponent({ name, export: name, filePath: '@tma.js/vue-kit' });
    });
  },
});
