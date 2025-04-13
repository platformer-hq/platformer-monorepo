import {
  createMemo,
  createSignal,
  Match,
  onMount,
  Show,
  Switch,
} from 'solid-js';
import { GraphQLError } from 'solid-gql';
import { accessor, pickProps } from 'solid-utils';
import { useGqlQuery } from 'shared';
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
  securedRawLaunchParams: string;
}) {
  const [$error, setError] = createSignal<TypedErrorStatusPageError>();
  const $timeout = accessor(props, 'initTimeout');
  const $timeoutSignal = createTimeoutSignal($timeout);
  const $appID = accessor(props, 'appID');

  const [$appData, setAppData] = createSignal<[appFound: boolean, url?: Maybe<string>]>();
  useGqlQuery(
    GetAppUrl,
    () => [[{
      appID: $appID(),
      launchParams: props.securedRawLaunchParams,
    }, { signal: $timeoutSignal() }]],
    {
      freshAge: 0,
      onReady(_, data) {
        setAppData([true, data.appTelegramURL]);
      },
      onErrored(_, error) {
        if (GraphQLError.is(error) && error.isOfType('ERR_APP_NOT_FOUND')) {
          setAppData([false]);
        } else {
          setError(isTimeoutError(error) ? ['init', $timeout()] : error);
        }
      },
      shouldRetry(error) {
        return (
          !isTimeoutError(error)
          && !(GraphQLError.is(error) && error.isOfType('ERR_APP_NOT_FOUND'))
        );
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
      <Match when={$appData()}>
        {$app => (
          <Switch>
            <Match when={$app()[1]}>
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
            <Match when={$app()[0] ? 'found' as const : 'not-found' as const}>
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
        )}
      </Match>
    </Switch>
  );
}