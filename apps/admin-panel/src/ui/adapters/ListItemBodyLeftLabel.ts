import { withPlatform } from '@/platformed/withPlatform.js';
import ListAndroidItemBodyLeftLabel from '@/vue-ui/components/List/ListAndroid/ListAndroidItemBodyLeftLabel.vue';
import ListIosItemBodyLeftLabel from '@/vue-ui/components/List/ListIos/ListIosItemBodyLeftLabel.vue';

export default withPlatform({
  common: ListAndroidItemBodyLeftLabel,
  ios: ListIosItemBodyLeftLabel,
});
