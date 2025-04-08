import {
  createMemo,
  createSignal,
  Match,
  onMount,
  Show,
  Switch,
} from 'solid-js';
import { GraphQLError, type UseGqlError } from 'solid-gql';
import { accessor, pickProps } from 'solid-utils';
import { useAuthToken, useGqlQuery } from 'shared';
import { isTimeoutError } from 'better-promises';

import {
  TypedErrorStatusPage,
  type TypedErrorStatusPageError,
} from '@/components/TypedErrorStatusPage/TypedErrorStatusPage.js';
import { AppNoURL } from '@/components/AppNoURL/AppNoURL.js';
import { AppNotFound } from '@/components/AppNotFound/AppNotFound.js';
import { AppContainer } from '@/components/AppContainer/AppContainer.js';
import { createTimeoutSignal } from '@/async/createTimeoutSignal.js';

import { GetAppUrl } from './operations.js';

function BootstrappedContainer(props: {
  loadTimeout: number;
  onError: (error: TypedErrorStatusPageError) => void;
  onReady: () => void;
  url: string;
}) {
  return (
    <Show
      when={props.url.startsWith('http://')}
      fallback={
        <AppContainer
          {...pickProps(props, ['url', 'loadTimeout', 'onReady'])}
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

export function AppLoader(props: {
  apiBaseURL: string;
  appID: number;
  fallbackURL?: Maybe<string>;
  initTimeout: number;
  loadTimeout: number;
  onError: (error: TypedErrorStatusPageError, fallbackURL?: string) => void;
  onReady: (fallbackURL?: string) => void;
  rawLaunchParams: string;
  securedRawInitData: string;
  securedRawLaunchParams: string;
}) {
  const [$error, setError] = createSignal<TypedErrorStatusPageError>();
  const $timeout = accessor(props, 'initTimeout');
  const $timeoutSignal = createTimeoutSignal($timeout);
  const $securedRawInitData = accessor(props, 'securedRawInitData');
  const $appID = accessor(props, 'appID');

  // Retrieve Platformer authorization token.
  const handleError = (fn: (error: UseGqlError) => void) => {
    return (_: any, error: UseGqlError) => {
      isTimeoutError(error)
        ? setError(['init', $timeout()])
        : fn(error);
    };
  };
  const [[$token, setToken]] = useAuthToken({
    appID: $appID,
    initData: $securedRawInitData,
    request: () => ({ signal: $timeoutSignal() }),
    onErrored: handleError(setError),
  });

  // Retrieve application data.
  const [$getAppUrlQuery] = useGqlQuery(
    GetAppUrl,
    () => {
      const token = $token();
      return token
        ? [[{ appID: $appID(), launchParams: props.securedRawLaunchParams, isExternal: true }, {
          signal: $timeoutSignal(),
          headers: { Authorization: `jwt ${token.token}` },
        }]]
        : false;
    },
    {
      freshAge: 0,
      onErrored: handleError(error => {
        if (GraphQLError.is(error) && error.isOfType('ERR_UNAUTHORIZED')) {
          // If the API considers the token as the expired one, we drop it and run the process
          // from the beginning.
          setToken();
        } else {
          setError(error);
        }
      }),
      shouldRetry(err) {
        // Do not retry if timeout was reached, or the token is considered expired.
        return !isTimeoutError(err)
          || !GraphQLError.is(err)
          || !err.isOfType('ERR_UNAUTHORIZED');
      },
      staleAge: 0,
    },
  );

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
              return <TypedErrorStatusPage error={$err()}/>;
            })()}
          >
            {$fallbackURL => (
              <BootstrappedContainer
                {...props}
                url={$fallbackURL()}
                onReady={() => {
                  props.onReady($fallbackURL());
                }}
                onError={error => {
                  props.onError(error, $fallbackURL());
                }}
              />
            )}
          </Show>
        )}
      </Match>
      <Match when={$getAppUrlQuery.state === 'ready' && $getAppUrlQuery()}>
        {$query => {
          const $result = ():
            | [appFound: true, telegramURL: Maybe<string>]
            | [appFound: false] => {
            const { app } = $query();
            return app ? [true, app.telegramURL] : [false];
          };

          return (
            <Switch>
              <Match when={$result()[1]}>
                {$telegramURL => {
                  // As long as we passed secured launch parameters to the server, we will receive
                  // them from it. Nevertheless, we should load the app using non-secured, initial
                  // launch parameters. That's why we replace them here.
                  const $url = createMemo(() => {
                    const url = new URL($telegramURL());
                    const hashParams = new URLSearchParams(url.hash.slice(1));
                    new URLSearchParams(props.rawLaunchParams).forEach((value, key) => {
                      hashParams.set(key, value);
                    });
                    url.hash = '#' + hashParams.toString();
                    return url.toString();
                  });

                  return (
                    <BootstrappedContainer
                      {...pickProps(props, ['loadTimeout', 'onReady'])}
                      url={$url()}
                      onError={setError}
                    />
                  );
                }}
              </Match>
              <Match when={$result()[0] ? 'found' as const : 'not-found' as const}>
                {$status => {
                  onMount(() => {
                    props.onReady();
                  });

                  return (
                    <Show when={$status() === 'found'} fallback={<AppNotFound/>}>
                      <AppNoURL/>
                    </Show>
                  );
                }}
              </Match>
            </Switch>
          );
        }}
      </Match>
    </Switch>
  );
}