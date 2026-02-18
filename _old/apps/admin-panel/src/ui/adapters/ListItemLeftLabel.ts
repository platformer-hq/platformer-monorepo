import { withPlatform } from '@/platformed/withPlatform.js';
import ListAndroidItemLeftLabel from '@/vue-ui/components/List/ListAndroid/ListAndroidItemLeftLabel.vue';
import ListIosItemLeftLabel from '@/vue-ui/components/List/ListIos/ListIosItemLeftLabel.vue';

export default withPlatform({
  common: ListAndroidItemLeftLabel,
  ios: ListIosItemLeftLabel,
});
