import { withPlatform } from '@/platformed/withPlatform.js';
import ListAndroidItemBodyRightClear from '@/vue-ui/components/List/ListAndroid/ListAndroidItemBodyRightClear.vue';
import ListIosItemBodyRightClear from '@/vue-ui/components/List/ListIos/ListIosItemBodyRightClear.vue';

export default withPlatform({
  common: ListAndroidItemBodyRightClear,
  ios: ListIosItemBodyRightClear,
});
