import { withPlatform } from '@/platformed/withPlatform.js';
import ListAndroidItemBodyRightSwitch from '@/vue-ui/components/List/ListAndroid/ListAndroidItemBodyRightSwitch.vue';
import ListIosItemBodyRightSwitch from '@/vue-ui/components/List/ListIos/ListIosItemBodyRightSwitch.vue';

export default withPlatform({
  common: ListAndroidItemBodyRightSwitch,
  ios: ListIosItemBodyRightSwitch,
});
