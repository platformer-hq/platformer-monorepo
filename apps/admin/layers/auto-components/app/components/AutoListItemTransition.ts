import { ListAndroidItemTransition, ListIosItemTransition } from '#components';

export default platformed({
  fallback: ListAndroidItemTransition,
  ios: ListIosItemTransition,
});
