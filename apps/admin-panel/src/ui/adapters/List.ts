import { withPlatform } from '@/platformed/withPlatform.js';
import ListAndroid from '@/vue-ui/components/List/ListAndroid/ListAndroid.vue';
import ListIos from '@/vue-ui/components/List/ListIos/ListIos.vue';

export default withPlatform({
  common: ListAndroid,
  ios: ListIos,
});
