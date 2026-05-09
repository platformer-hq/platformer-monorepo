import { ListAndroidItemTransitionGroup, ListIosItemTransitionGroup } from '@tma.js/vue-kit';

export default platformed({
  fallback: ListAndroidItemTransitionGroup,
  ios: ListIosItemTransitionGroup,
});
