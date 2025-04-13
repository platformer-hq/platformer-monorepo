import {
  createEffect,
  createMemo,
  createSignal,
  ErrorBoundary,
  Match,
  Show,
  Switch,
} from 'solid-js';
import type { Platform } from '@telegram-apps/sdk-solid';
import { pickProps, accessor } from 'solid-utils';
import { GqlProvider } from 'shared';

import { AppLoader } from '@/components/AppLoader/AppLoader.js';
import { ErrorStatusPage } from '@/components/ErrorStatusPage/ErrorStatusPage.js';
import { StatusPage } from '@/components/StatusPage/StatusPage.js';
import { MainProvider, useMainContext } from '@/providers/MainProvider.js';
import {
  TypedErrorStatusPage,
  type TypedErrorStatusPageError,
} from '@/components/TypedErrorStatusPage/TypedErrorStatusPage.js';
import type { InitialColorsTuple } from '@/types/common.js';

import { useLauncherOptions } from './useLauncherOptions.js';
import { computeFallbackURL } from './utils.js';

import './Root.scss';

interface InnerProps {
  debug: boolean;
  rawInitData?: string;
  rawLaunchParams: string;
}

interface RootProps extends InnerProps {
  platform: Platform;
  initialColors: InitialColorsTuple;
  logger: Pick<Console, 'log' | 'group' | 'groupEnd'>;
}

function Inner(props: InnerProps) {
  const [$options, $error] = useLauncherOptions();
  const context = useMainContext();
  const $platform = accessor(context, 'platform');
  const [$loaderReady, setLoaderReady] = createSignal(false);

  createEffect(() => {
    $loaderReady() && context.logger.log('Removing the loader');
  });

  return (
    <main
      classList={{
        'root': true,
        'root--mobile': (['android', 'android_x', 'ios'] satisfies Platform[]).includes($platform()),
      }}
    >
      <Show
        when={$options.ok() && $options()}
        fallback={<ErrorStatusPage title="Configuration is invalid" text={$error()}/>}
      >
        {$opts => (
          <GqlProvider endpoint={$opts().apiBaseURL}>
            <Show
              when={props.rawInitData}
              fallback={
                <ErrorStatusPage
                  title="Init data is missing"
                  text="For some reason, init data is missing. It is the most likely that the application was launched improperly"
                />
              }
            >
              {$rawInitData => {
                // Error occurred during application loading.
                const [$error, setError] = createSignal<TypedErrorStatusPageError>();

                // Compute fallback URL in case something went wrong with Platformer.
                const $fallbackURL = createMemo(() => {
                  const { fallbackURL } = $opts();
                  return fallbackURL
                    ? computeFallbackURL(fallbackURL, props.rawLaunchParams)
                    : undefined;
                });
                const $securedRawLaunchParams = createMemo(() => {
                  // We are sanitizing the "hash" property for security purposes, so Platformer
                  // could not use this init data to impersonate user. Instead, Platformer uses the
                  // "signature" property allowing third parties to validate the init data.
                  const initDataQuery = new URLSearchParams($rawInitData());
                  initDataQuery.set('hash', '');

                  const launchParamsQuery = new URLSearchParams(props.rawLaunchParams);
                  launchParamsQuery.set('tgWebAppData', initDataQuery.toString());
                  return launchParamsQuery.toString();
                });

                return (
                  <Switch>
                    <Match when={$error()}>
                      {$err => <TypedErrorStatusPage error={$err()}/>}
                    </Match>
                    <Match when>
                      <Show when={!$loaderReady()}>
                        <StatusPage state="loading"/>
                      </Show>
                      <AppLoader
                        {...pickProps(
                          $opts(),
                          ['apiBaseURL', 'appID', 'initTimeout', 'loadTimeout'],
                        )}
                        {...pickProps(props, ['rawLaunchParams'])}
                        fallbackURL={$fallbackURL()}
                        securedRawLaunchParams={$securedRawLaunchParams()}
                        onError={(error, fallbackURL) => {
                          fallbackURL && console.error('Fallback URL failed to load:', fallbackURL);
                          setError(error);
                          setLoaderReady(true);
                        }}
                        onReady={(fallbackURL) => {
                          fallbackURL && console.warn(
                            'Platformer failed to load. Used fallback:',
                            fallbackURL,
                          );
                          setLoaderReady(true);
                        }}
                      />
                    </Match>
                  </Switch>
                );
              }}
            </Show>
          </GqlProvider>
        )}
      </Show>
    </main>
  );
}

export function Root(props: RootProps) {
  return (
    <MainProvider {...pickProps(props, ['platform', 'initialColors', 'logger'])}>
      <ErrorBoundary fallback={error => <TypedErrorStatusPage error={['unknown', error]}/>}>
        <Inner {...props}/>
      </ErrorBoundary>
    </MainProvider>
  );
}
