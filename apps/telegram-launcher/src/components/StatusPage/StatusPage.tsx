import { type JSXElement, Show } from 'solid-js';
import { bem, Xmark28, LoadingIndicatorIos, TypographyIos } from 'ui';
import { accessor } from 'solid-utils';

import { useMainContext } from '@/providers/MainProvider.js';

import './StatusPage.scss';

export interface StatusPageProps {
  state?: 'error' | 'loading';
  text?: JSXElement;
  title?: string;
}

const [b, e] = bem('status-page');

export function StatusPage(props: StatusPageProps) {
  const context = useMainContext();
  const $platform = () => {
    return ['ios', 'macos'].includes(context.platform) ? 'ios' : 'base';
  };
  const $title = accessor(props, 'title');
  const $text = accessor(props, 'text');

  return (
    <div class={b()}>
      <div class={e('image')}>
        <svg
          class={e('logo')}
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
          fill="none"
        >
          <rect width="80" height="80" fill="url(#a)" rx="18.667"/>
          <path
            fill="#fff"
            d="M15.663 46.588c1.366 1.044 3.435 2.238 6.205 3.838l6.562 3.788c5.468 3.157 8.202 4.736 11.6 4.736 3.396 0 6.13-1.579 11.598-4.736l6.562-3.788c2.77-1.6 4.84-2.794 6.206-3.838 1.33 1.016 1.996 1.89 1.996 2.858 0 1.962-2.734 3.54-8.202 6.697l-6.562 3.788c-5.468 3.157-8.202 4.736-11.599 4.736S33.9 63.088 28.43 59.93l-6.562-3.788c-5.467-3.157-8.201-4.735-8.201-6.697 0-.967.665-1.842 1.995-2.858"
          />
          <path
            fill="#fff"
            d="M15.663 36.642c1.366 1.044 3.435 2.238 6.205 3.837l6.562 3.79c5.468 3.156 8.202 4.734 11.6 4.734 3.396 0 6.13-1.578 11.598-4.735l6.562-3.788c2.77-1.6 4.84-2.794 6.206-3.838 1.33 1.016 1.996 1.89 1.996 2.858 0 1.961-2.734 3.54-8.202 6.697l-6.562 3.788c-5.468 3.157-8.202 4.735-11.599 4.735s-6.13-1.578-11.599-4.735l-6.562-3.788c-5.467-3.157-8.201-4.736-8.201-6.697 0-.968.665-1.842 1.995-2.858"
          />
          <path
            fill="#fff"
            d="M21.868 36.25c-5.467-3.156-8.201-4.735-8.201-6.696 0-1.962 2.734-3.54 8.201-6.697l6.562-3.788c5.468-3.157 8.202-4.736 11.6-4.736 3.396 0 6.13 1.579 11.598 4.736l6.562 3.788c5.468 3.157 8.202 4.735 8.202 6.697s-2.734 3.54-8.202 6.696l-6.562 3.789c-5.468 3.157-8.202 4.735-11.599 4.735S33.9 43.196 28.43 40.04z"
          />
          <defs>
            <linearGradient id="a" x1="40" x2="40" y1="0" y2="80" gradientUnits="userSpaceOnUse">
              <stop stop-color="#7688FF"/>
              <stop offset="1" stop-color="#5A6EF5"/>
            </linearGradient>
          </defs>
        </svg>
        <Show when={props.state === 'error'}>
          <Xmark28 class={e('error-icon')}/>
        </Show>
      </div>
      <Show
        when={$title() || $text()}
        fallback={
          <div class={e('loader', $platform())}>
            <Show
              when={$platform() === 'ios'}
              fallback={
                <svg class={e('loader-base-root')}>
                  <circle
                    cx="50%"
                    cy="50%"
                    r="50%"
                    stroke-linecap="round"
                    stroke="currentcolor"
                  />
                </svg>
              }
            >
              <LoadingIndicatorIos size={28}/>
            </Show>
          </div>
        }
      >
        <div class={e('content')}>
          <TypographyIos class={e('title')} variant="title1">
            {$title()}
          </TypographyIos>
          <Show when={$text()}>
            <TypographyIos class={e('text')} variant="body">
              {$text()}
            </TypographyIos>
          </Show>
        </div>
      </Show>
    </div>
  );
}

