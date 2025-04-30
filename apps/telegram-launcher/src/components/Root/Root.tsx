import {
  createEffect,
  createMemo,
  createSignal,
  ErrorBoundary,
  Match,
  Show,
  Switch,
} from 'solid-js';
import { Transition } from 'solid-transition-group';
import type { Platform } from '@telegram-apps/sdk-solid';
import { pickProps } from 'solid-utils';
import { GqlProvider } from 'shared';
import { bem } from 'utils';

import { AppLoader } from '@/components/AppLoader/AppLoader.js';
import { StatusPage } from '@/components/StatusPage/StatusPage.js';
import {
  MainProvider,
  useLogger,
  useMainContext,
  useTranslator,
} from '@/providers/MainProvider.js';
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

const [b, e] = bem('root');

function Inner(props: InnerProps) {
  const [$options, $error] = useLauncherOptions();
  const context = useMainContext();

  return (
    <main
      class={b(
        ([
          'android',
          'android_x',
          'ios',
        ] satisfies Platform[]).includes(context.platform) && 'mobile',
      )}
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
                  const logger = useLogger();
                  const [$loaderError, setLoaderError] = createSignal<ErrorStatusPageError>();
                  const [$loaderReady, setLoaderReady] = createSignal(false);
                  const [$currentStep, setCurrentStep] = createSignal<'getting-data' | 'waiting-load'>(
                    'getting-data');
                  const t = useTranslator({
                    en: {
                      gettingData: 'Getting app data',
                      waitingLoad: 'Waiting for the app to be ready',
                    },
                    ru: {
                      gettingData: 'Получаем информацию о приложении',
                      waitingLoad: 'Ожидаем загрузки приложения',
                    },
                  });

                  createEffect(() => {
                    $loaderReady() && logger.log('Removing the loader');
                  });

                  // Compute fallback URL in case something went wrong with Platformer.
                  const $fallbackURL = createMemo(() => {
                    const { fallbackURL } = $opts();
                    return fallbackURL
                      ? computeFallbackURL(fallbackURL, props.rawLaunchParams)
                      : undefined;
                  });
                  const $securedRawLaunchParams = createMemo(() => {
                    // We are sanitizing the "hash" property for security purposes, so Platformer
                    // could not use this init data to impersonate user. Instead, Platformer uses
                    // the "signature" property allowing third parties to validate the init data.
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
                              setLoaderReady(false);
                              setLoaderError();
                              setCurrentStep('getting-data');
                            }}
                          />
                        )}
                      </Match>
                      <Match when>
                        <Transition
                          onExit={(el, done) => {
                            return el
                              .animate({
                                clipPath: ['circle(100% at 50% 50%)', 'circle(20% at 50% 50%)'],
                                opacity: [1, 0],
                                transform: ['scale(1)', 'scale(1.05)'],
                                backgroundSize: ['100% 111%', '100% 100%', '100% 100%'],
                              }, { duration: 200, easing: 'ease-out' })
                              .finished
                              .then(done);
                          }}
                        >
                          <Show when={!$loaderReady()}>
                            <StatusPage
                              class={e('status')}
                              state="loading"
                              text={t($currentStep() === 'getting-data' ? 'gettingData' : 'waitingLoad')}
                            />
                          </Show>
                        </Transition>
                        <AppLoader
                          {...pickProps(
                            $opts(),
                            ['apiBaseURL', 'appID', 'initTimeout', 'loadTimeout'],
                          )}
                          {...pickProps(props, ['rawLaunchParams'])}
                          fallbackURL={$fallbackURL()}
                          securedRawLaunchParams={$securedRawLaunchParams()}
                          onError={(error, fallbackURL) => {
                            fallbackURL && logger.forceError(
                              'Fallback URL failed to load:',
                              fallbackURL,
                            );
                            setLoaderError(error);
                            setLoaderReady(true);
                          }}
                          onReady={(fallbackURL) => {
                            fallbackURL && logger.forceWarn(
                              'Platformer failed to load. Used fallback:',
                              fallbackURL,
                            );
                            setLoaderReady(true);
                          }}
                          onAppDataRetrieved={() => {
                            setCurrentStep('waiting-load');
                          }}
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
