import { withPlatform } from '@/platformed/withPlatform.js';
import ListAndroidItemBodyRight from '@/vue-ui/components/List/ListAndroid/ListAndroidItemBodyRight.vue';
import ListIosItemBodyRight from '@/vue-ui/components/List/ListIos/ListIosItemBodyRight.vue';

export default withPlatform({
  common: ListAndroidItemBodyRight,
  ios: ListIosItemBodyRight,
});
