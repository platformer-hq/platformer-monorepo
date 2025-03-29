import {
  createEffect,
  createMemo,
  createSignal,
  Match,
  mergeProps,
  onMount,
  Show,
  splitProps,
  Switch,
} from 'solid-js';

import { AppContainer } from '@/components/AppContainer/AppContainer.js';
import { AppNotFound } from '@/components/AppNotFound/AppNotFound.js';
import {
  LauncherLoadError,
  type AppLoadErrorError,
} from '@/components/LauncherLoadError/LauncherLoadError.js';
import { AppNoURL } from '@/components/AppNoURL/AppNoURL.js';
import { createTimeoutSignal } from '@/async/createTimeoutSignal.js';
import { authenticate } from '@/api/authenticate.js';
import { getAppUrl } from '@/api/getAppUrl.js';
import { createExecutionResource } from '@/helpers/createExecutionResource.js';

function BootstrappedContainer(props: {
  loadTimeout: number;
  onError: (error: AppLoadErrorError) => void;
  onReady: () => void;
  url: string;
}) {
  const [picked] = splitProps(props, ['url', 'loadTimeout', 'onReady']);
  return (
    <Show
      when={props.url.startsWith('http://')}
      fallback={
        <AppContainer
          {...picked}
          onError={() => {
            props.onError(['iframe']);
          }}
          onTimeout={() => {
            props.onError(['iframe', true]);
          }}
        />
      }
    >
      {(() => {
        // Web doesn't support loading iframes with an HTTP URL in the secure context. All we
        // can do is just to redirect to the URL.
        window.location.href = props.url;
        props.onReady();
        return null;
      })()}
    </Show>
  );
}

function BasicBootstrap(props: {
  apiBaseURL: string;
  appID: number;
  fallbackURL?: Maybe<string>;
  initTimeout: number;
  loadTimeout: number;
  onError: (error: AppLoadErrorError, fallbackURL?: string) => void;
  onReady: (fallbackURL?: string) => void;
  rawLaunchParams: string;
  securedInitData: string;
  securedLaunchParams: string;
}) {
  const $abortSignal = createTimeoutSignal(() => props.initTimeout);
  const [$error, setError] = createSignal<AppLoadErrorError>();
  const requestsOptions = () => mergeProps(props, {
    abortSignal: $abortSignal(),
    launchParams: props.securedLaunchParams,
    initData: props.securedInitData,
  });

  // Retrieve Platformer authorization token.
  const [$authToken] = createExecutionResource(requestsOptions, async options => {
    return authenticate(options);
    // TODO: Uncomment this code when we have a proper failed authentication handling.
    // const token = getAuthTokenFromStorage();
    // return token
    //   ? [true, token]
    //   : authenticate(options).then(tuple => {
    //     if (tuple[0]) {
    //     saveAuthTokenToStorage(tuple[1].token, tuple[1].expiresAt);
    //     }
    //     return tuple;
    //   });
  }, { onError: setError });

  // Retrieve application data.
  const [$app] = createExecutionResource(
    () => {
      const authToken = $authToken.state === 'ready' ? $authToken().token : undefined;
      return authToken ? mergeProps(requestsOptions(), { authToken }) : false;
    },
    getAppUrl,
    { onError: setError },
  );

  // If some error occurred, and we have no fallback URL specified, we should notify the parent
  // component about the error.
  createEffect(() => {
    const e = $error();
    e && !props.fallbackURL && props.onError(e);
  });

  return (
    <Switch>
      <Match when={$error()}>
        {$err => (
          <Show
            when={props.fallbackURL}
            fallback={(() => {
              // We don't have a fallback URL. It means that the application failed to load,
              // and we have nothing to display instead of the error screen.
              onMount(() => {
                props.onError($err());
              });
              return <LauncherLoadError error={$err()}/>;
            })()}
          >
            {$url => (
              <BootstrappedContainer
                {...props}
                url={$url()}
                onReady={() => {
                  props.onReady($url());
                }}
                onError={error => {
                  props.onError(error, $url());
                }}
              />
            )}
          </Show>
        )}
      </Match>
      <Match when={$app.state === 'ready' && $app()}>
        {$tuple => (
          <Switch fallback={<AppNoURL/>}>
            <Match when={$tuple()[1]}>
              {$url => {
                const $urlComplete = createMemo(() => {
                  const url = new URL($url());
                  const hashParams = new URLSearchParams(url.hash.slice(1));
                  new URLSearchParams(props.rawLaunchParams).forEach((value, key) => {
                    hashParams.set(key, value);
                  });
                  url.hash = '#' + hashParams.toString();
                  return url.toString();
                });

                return (
                  <BootstrappedContainer
                    {...props}
                    url={$urlComplete()}
                    onError={setError}
                  />
                );
              }}
            </Match>
            <Match
              when={
                !$tuple()[1]
                  ? $tuple()[0]
                    ? 'no-url'
                    : 'no-app'
                  : false
              }
            >
              {$type => {
                onMount(() => {
                  props.onReady();
                });

                return (
                  <Show when={$type() === 'no-app'} fallback={<AppNoURL/>}>
                    <AppNotFound/>
                  </Show>
                );
              }}
            </Match>
          </Switch>
        )}
      </Match>
    </Switch>
  );
}

/**
 * Performs complete application load lifecycle.
 */
export function BootstrapApp(props: {
  apiBaseURL: string;
  appID: number;
  fallbackURL?: Maybe<string>;
  initTimeout: number;
  loadTimeout: number;
  onReady: () => void;
  /**
   * Launch parameters in their initial format.
   */
  rawLaunchParams: string;
  /**
   * Init data containing no hash part.
   */
  securedInitData: string;
  /**
   * Launch parameters containing init data in a secured format.
   */
  securedLaunchParams: string;
}) {
  const [$error, setError] = createSignal<AppLoadErrorError>();

  return (
    <Switch>
      <Match when={$error()}>
        {$err => <LauncherLoadError error={$err()}/>}
      </Match>
      <Match when={true}>
        <BasicBootstrap
          {...props}
          onError={(error, fallbackURL) => {
            fallbackURL && console.error('Fallback URL failed to load:', fallbackURL);
            setError(error);
            props.onReady();
          }}
          onReady={(fallbackURL) => {
            fallbackURL && console.warn('Platformer failed to load. Used fallback:', fallbackURL);
            props.onReady();
          }}
        />
      </Match>
    </Switch>
  );
}