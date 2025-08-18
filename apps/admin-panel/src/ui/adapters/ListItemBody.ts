import { withPlatform } from '@/platformed/withPlatform.js';
import ListAndroidItemBody from '@/vue-ui/components/List/ListAndroid/ListAndroidItemBody.vue';
import ListIosItemBody from '@/vue-ui/components/List/ListIos/ListIosItemBody.vue';

export default withPlatform({
  common: ListAndroidItemBody,
  ios: ListIosItemBody,
});
