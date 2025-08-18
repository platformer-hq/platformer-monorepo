import { withPlatform } from '@/platformed/withPlatform.js';
import SwitchAndroid from '@/vue-ui/components/Switch/SwitchAndroid.vue';
import SwitchIos from '@/vue-ui/components/Switch/SwitchIos.vue';

export default withPlatform({
  common: SwitchAndroid,
  ios: SwitchIos,
});
