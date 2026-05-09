import { ListAndroidItemTransition, ListIosItemTransition } from '@tma.js/vue-kit';

export default platformed({
  fallback: ListAndroidItemTransition,
  ios: ListIosItemTransition,
});
