import type { Platform } from '@telegram-apps/sdk-solid';

import { Loader } from '@/components/Loader/Loader.js';

import loader from './app-loader.svg?no-inline';
import './AppLoading.scss';

export function AppLoading(props: { platform?: Platform }) {
  return (
    <div class="app-loading">
      <img class="app-loading__image" alt="" src={loader}/>
      <Loader platform={props.platform}/>
    </div>
  );
}

