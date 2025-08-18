import { withPlatform } from '@/platformed/withPlatform.js';
import ListAndroidItemBodyLeftSubtitle from '@/vue-ui/components/List/ListAndroid/ListAndroidItemBodyLeftSubtitle.vue';
import ListIosItemBodyLeftSubtitle from '@/vue-ui/components/List/ListIos/ListIosItemBodyLeftSubtitle.vue';

export default withPlatform({
  common: ListAndroidItemBodyLeftSubtitle,
  ios: ListIosItemBodyLeftSubtitle,
});
