import { withPlatform } from '@/platformed/withPlatform.js';
import ListAndroidItemBodyRightCounter from '@/vue-ui/components/List/ListAndroid/ListAndroidItemBodyRightCounter.vue';
import ListIosItemBodyRightCounter from '@/vue-ui/components/List/ListIos/ListIosItemBodyRightCounter.vue';

export default withPlatform({
  common: ListAndroidItemBodyRightCounter,
  ios: ListIosItemBodyRightCounter,
});
