import { withPlatform } from '@/platformed/withPlatform.js';
import ListAndroidItemBodyRightRadio from '@/vue-ui/components/List/ListAndroid/ListAndroidItemBodyRightRadio.vue';
import ListIosItemBodyRightRadio from '@/vue-ui/components/List/ListIos/ListIosItemBodyRightRadio.vue';

export default withPlatform({
  common: ListAndroidItemBodyRightRadio,
  ios: ListIosItemBodyRightRadio,
});
