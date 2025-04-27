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
import { StatusPage } from '@/components/StatusPage/StatusPage.js';
import { MainProvider, useLogger, useMainContext } from '@/providers/MainProvider.js';
import {
  ErrorStatusPage,
  type ErrorStatusPageError,
} from '@/components/ErrorStatusPage/ErrorStatusPage.js';
import type { InitialColorsTuple, Locale, Logger } from '@/types/common.js';

import { useLauncherOptions } from './useLauncherOptions.js';
import { computeFallbackURL } from './utils.js';

import './Root.scss';

interface InnerProps {
  debug: boolean;
  rawInitData?: string;
  rawLaunchParams: string;
}

interface RootProps extends InnerProps {
  initialColors: InitialColorsTuple;
  locale: Locale;
  logger: Logger;
  platform: Platform;
}

function Inner(props: InnerProps) {
  const [$options, $error] = useLauncherOptions();
  const context = useMainContext();
  const logger = useLogger();
  const $platform = accessor(context, 'platform');
  const [$loaderReady, setLoaderReady] = createSignal(false);

  createEffect(() => {
    $loaderReady() && logger.log('Removing the loader');
  });

  return (
    <main
      classList={{
        'root': true,
        'root--mobile': ([
          'android',
          'android_x',
          'ios',
        ] satisfies Platform[]).includes($platform()),
      }}
    >
      <Switch>
        <Match when={$error.ok() && $error()}>
          {$$error => (
            <ErrorStatusPage error={['config-invalid', $$error()]}/>
          )}
        </Match>
        <Match when={$options.ok() && $options()}>
          {$opts => (
            <GqlProvider endpoint={$opts().apiBaseURL}>
              <Show
                when={props.rawInitData}
                fallback={<ErrorStatusPage error={['init-data-missing']}/>}
              >
                {$rawInitData => {
                  // Error occurred during application loading.
                  const [$loaderError, setLoaderError] = createSignal<ErrorStatusPageError>();
                  // We only need this signal to restart the AppLoader.
                  const [$retrySeed, setRetrySeed] = createSignal<number>(1);

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
                      <Match when={$loaderError()}>
                        {$$loaderError => (
                          <ErrorStatusPage
                            error={$$loaderError()}
                            onRetry={() => {
                              setRetrySeed($retrySeed() + 1);
                            }}
                          />
                        )}
                      </Match>
                      <Match when>
                        <Show when={!$loaderReady()}>
                          {/*todo: step*/}
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
                            setLoaderError(error);
                            setLoaderReady(true);
                          }}
                          onReady={(fallbackURL) => {
                            fallbackURL && console.warn(
                              'Platformer failed to load. Used fallback:',
                              fallbackURL,
                            );
                            setLoaderReady(true);
                          }}
                          retrySeed={$retrySeed()}
                        />
                      </Match>
                    </Switch>
                  );
                }}
              </Show>
            </GqlProvider>
          )}
        </Match>
      </Switch>
    </main>
  );
}

export function Root(props: RootProps) {
  return (
    <MainProvider {...pickProps(props, ['platform', 'initialColors', 'logger', 'locale'])}>
      <ErrorBoundary
        fallback={(error, reset) => (
          <ErrorStatusPage error={error} onRetry={reset}/>
        )}
      >
        <Inner {...props}/>
      </ErrorBoundary>
    </MainProvider>
  );
}
