import { createMemo, createSignal, ErrorBoundary, Show } from 'solid-js';
import {
  retrieveRawLaunchParams,
  retrieveRawInitData,
  transformQueryUsing,
  type Platform,
  type MiniAppHeaderColor,
  type BackgroundColor,
  type BottomBarColor,
} from '@telegram-apps/sdk-solid';
import {
  instance,
  looseObject,
  optional,
  pipe,
  string,
  transform,
  parse,
  ValiError,
  union,
} from 'valibot';
import { pickProps, accessor } from 'solid-utils';

import { BootstrapApp } from '@/components/BootstrapApp/BootstrapApp.js';
import { RootErrorBoundary } from '@/components/RootErrorBoundary/RootErrorBoundary.js';
import { positiveIntFromStr } from '@/validation/positiveIntFromStr.js';
import { splitExecutionTuple } from '@/helpers/splitExecutionTuple.js';
import { ErrorStatusPage } from '@/components/ErrorStatusPage/ErrorStatusPage.js';
import { StatusPage } from '@/components/StatusPage/StatusPage.js';
import { MainProvider, useMainContext } from '@/providers/MainProvider.js';

import { computeFallbackURL, secureInitData, secureLaunchParams } from './utils.js';

import './Root.scss';

function useLauncherOptions() {
  return splitExecutionTuple<{
    appID: number;
    apiBaseURL: string;
    fallbackURL?: Maybe<string>;
    initTimeout: number;
    loadTimeout: number;
  }, string>(() => {
    try {
      const argsObject = parse(
        pipe(
          union([instance(URLSearchParams), string()]),
          transformQueryUsing(
            looseObject({
              app_id:
                optional(positiveIntFromStr(), '1'),
              // positiveIntFromStr(),
              api_base_url: optional(
                pipe(
                  string(),
                  transform(v => new URL(v, window.location.origin).toString()),
                ),
                'https://mini-apps.store/gql',
              ),
              fallback_url: optional(string()),
              init_timeout: optional(positiveIntFromStr(), '5000'),
              load_timeout: optional(positiveIntFromStr(), '1000000'),
            }),
          ),
        ),
        new URLSearchParams(
          // Telegram API has a bug replacing & with &amp; for some reason. We are replacing it
          // back.
          window.location.search.replace(/&amp;/g, '&'),
        ),
      );
      return [true, {
        appID: argsObject.app_id,
        apiBaseURL: argsObject.api_base_url,
        fallbackURL: argsObject.fallback_url,
        initTimeout: argsObject.init_timeout,
        loadTimeout: argsObject.load_timeout,
      }];
    } catch (e) {
      return [false, (e as ValiError<never>).message];
    }
  });
}

interface InnerProps {
  debug: boolean;
  initialColors: [
    header: MiniAppHeaderColor,
    background: BackgroundColor,
    bottomBar: BottomBarColor
  ];
}

interface RootProps extends InnerProps {
  platform: Platform;
}

function Inner(props: InnerProps) {
  const [$options, $error] = useLauncherOptions();
  const context = useMainContext();
  const $platform = accessor(context, 'platform');

  // Wait for the bootstrapper to load.
  const [$bootstrapperReady, setBootstrapperReady] = createSignal(false);

  const rawInitData = retrieveRawInitData() || '';

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
          <Show
            when={
              // We are sanitizing the hash property for security purposes, so Platformer could not
              // use this init data to impersonate user. Instead, Platformer uses the "signature"
              // property allowing third parties to validate the init data.
              secureInitData(rawInitData)
            }
            fallback={
              <ErrorStatusPage
                title="Init data is missing"
                text="For some reason, init data is missing. It is the most likely that the application was launched improperly"
              />
            }
          >
            {$securedInitData => {
              const rawLaunchParams = retrieveRawLaunchParams();
              const $securedLaunchParams = createMemo(() => {
                // Here we do the same thing as we did with the init data - we secure it by
                // replacing exposed init data with the secured one.
                return secureLaunchParams(rawLaunchParams, $securedInitData());
              });

              // Compute fallback URL in case something went wrong with Platformer.
              const $fallbackURL = createMemo(() => {
                const { fallbackURL } = $opts();
                return fallbackURL ? computeFallbackURL(fallbackURL, rawLaunchParams) : undefined;
              });

              return (
                <>
                  <Show when={!$bootstrapperReady()}>
                    <StatusPage state="loading"/>
                  </Show>
                  <BootstrapApp
                    {...$opts()}
                    fallbackURL={$fallbackURL()}
                    onReady={() => {
                      setBootstrapperReady(true);
                    }}
                    rawLaunchParams={rawLaunchParams}
                    securedInitData={$securedInitData()}
                    securedLaunchParams={$securedLaunchParams()}
                  />
                </>
              );
            }}
          </Show>
        )}
      </Show>
    </main>
  );
}

export function Root(props: RootProps) {
  return (
    <MainProvider {...pickProps(props, 'platform')}>
      <ErrorBoundary fallback={RootErrorBoundary}>
        <Inner {...props}/>
      </ErrorBoundary>
    </MainProvider>
  );
}
