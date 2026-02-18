import { withPlatform } from '@/platformed/withPlatform.js';
import ListAndroidItemBodyRightChevron from '@/vue-ui/components/List/ListAndroid/ListAndroidItemBodyRightChevron.vue';
import ListIosItemBodyRightChevron from '@/vue-ui/components/List/ListIos/ListIosItemBodyRightChevron.vue';

export default withPlatform({
  common: ListAndroidItemBodyRightChevron,
  ios: ListIosItemBodyRightChevron,
});
