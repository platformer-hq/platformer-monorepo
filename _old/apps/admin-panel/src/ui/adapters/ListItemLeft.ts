import { withPlatform } from '@/platformed/withPlatform.js';
import ListAndroidItemLeft from '@/vue-ui/components/List/ListAndroid/ListAndroidItemLeft.vue';
import ListIosItemLeft from '@/vue-ui/components/List/ListIos/ListIosItemLeft.vue';

export default withPlatform({
  common: ListAndroidItemLeft,
  ios: ListIosItemLeft,
});
