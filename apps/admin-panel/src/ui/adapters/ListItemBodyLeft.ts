import { withPlatform } from '@/platformed/withPlatform.js';
import ListAndroidItemBodyLeft from '@/vue-ui/components/List/ListAndroid/ListAndroidItemBodyLeft.vue';
import ListIosItemBodyLeft from '@/vue-ui/components/List/ListIos/ListIosItemBodyLeft.vue';

export default withPlatform({
  common: ListAndroidItemBodyLeft,
  ios: ListIosItemBodyLeft,
});
