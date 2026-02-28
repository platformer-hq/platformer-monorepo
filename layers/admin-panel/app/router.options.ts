import type { RouterConfig } from '@nuxt/schema';

export default <RouterConfig>{
  scrollBehavior() {
    // We completely disable scroll restoration as we want to have a manual control.
    return false;
  },
};
