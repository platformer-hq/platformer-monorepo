import { SwitchAndroid, SwitchIos } from '@tma.js/vue-kit';

export default platformed({ fallback: SwitchAndroid, ios: SwitchIos });
