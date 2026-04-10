import { SwitchAndroid, SwitchIos } from '@workspace/ui-kit';

export default platformed({ fallback: SwitchAndroid, ios: SwitchIos });
