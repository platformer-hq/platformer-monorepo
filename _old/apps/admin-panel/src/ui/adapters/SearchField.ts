import { withPlatform } from '@/platformed/withPlatform.js';
import SearchFieldAndroid from '@/vue-ui/components/SearchField/SearchFieldAndroid.vue';
import SearchFieldIos from '@/vue-ui/components/SearchField/SearchFieldIos.vue';

export default withPlatform({
  common: SearchFieldAndroid,
  ios: SearchFieldIos,
});
