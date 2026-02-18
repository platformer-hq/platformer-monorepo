import { withPlatform } from '@/platformed/withPlatform.js';
import ListAndroidItemBodyInput from '@/vue-ui/components/List/ListAndroid/ListAndroidItemBodyInput.vue';
import ListIosItemBodyInput from '@/vue-ui/components/List/ListIos/ListIosItemBodyInput.vue';

export default withPlatform({
  common: ListAndroidItemBodyInput,
  ios: ListIosItemBodyInput,
});
