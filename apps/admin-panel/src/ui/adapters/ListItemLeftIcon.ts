import { withPlatform } from '@/platformed/withPlatform.js';
import ListAndroidItemLeftIcon from '@/vue-ui/components/List/ListAndroid/ListAndroidItemLeftIcon.vue';
import ListIosItemLeftIcon from '@/vue-ui/components/List/ListIos/ListIosItemLeftIcon.vue';

export default withPlatform({
  common: ListAndroidItemLeftIcon,
  ios: ListIosItemLeftIcon,
});
