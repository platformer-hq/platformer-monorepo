/* @refresh reload */
import { render } from 'solid-js/web';

import { Root } from '@/components/Root/Root.js';

import './index.scss';
import './mockEnv.js';

render(() => <Root/>, document.getElementById('root')!);
