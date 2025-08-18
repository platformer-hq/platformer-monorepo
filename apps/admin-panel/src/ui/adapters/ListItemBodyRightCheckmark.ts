import { withPlatform } from '@/platformed/withPlatform.js';
import ListAndroidItemBodyRightCheckmark from '@/vue-ui/components/List/ListAndroid/ListAndroidItemBodyRightCheckmark.vue';
import ListIosItemBodyRightCheckmark from '@/vue-ui/components/List/ListIos/ListIosItemBodyRightCheckmark.vue';

export default withPlatform({
  common: ListAndroidItemBodyRightCheckmark,
  ios: ListIosItemBodyRightCheckmark,
});
