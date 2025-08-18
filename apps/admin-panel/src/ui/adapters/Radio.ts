import { withPlatform } from '@/platformed/withPlatform.js';
import RadioAndroid from '@/vue-ui/components/Radio/RadioAndroid.vue';
import RadioIos from '@/vue-ui/components/Radio/RadioIos.vue';

export default withPlatform({
  common: RadioAndroid,
  ios: RadioIos,
});
