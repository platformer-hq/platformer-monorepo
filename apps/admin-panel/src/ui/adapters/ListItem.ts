import { withPlatform } from '@/platformed/withPlatform.js';
import ListAndroidItem from '@/vue-ui/components/List/ListAndroid/ListAndroidItem.vue';
import ListIosItem from '@/vue-ui/components/List/ListIos/ListIosItem.vue';

export default withPlatform({
  common: ListAndroidItem,
  ios: ListIosItem,
});
