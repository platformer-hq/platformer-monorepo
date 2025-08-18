import { withPlatform } from '@/platformed/withPlatform.js';
import ListAndroidItemBodyRightLabel from '@/vue-ui/components/List/ListAndroid/ListAndroidItemBodyRightLabel.vue';
import ListIosItemBodyRightLabel from '@/vue-ui/components/List/ListIos/ListIosItemBodyRightLabel.vue';

export default withPlatform({
  common: ListAndroidItemBodyRightLabel,
  ios: ListIosItemBodyRightLabel,
});
