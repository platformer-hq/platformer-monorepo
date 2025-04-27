import { createEffect, createMemo, Match, onCleanup, Show, Switch } from 'solid-js';
import { type UseGqlError, GraphQLError } from 'solid-gql';
import { TypographyIos } from 'ui';
import { is, looseObject, string, ValiError } from 'valibot';
import { onMainButtonClick, setMainButtonParams } from '@telegram-apps/sdk-solid';

import { useTranslator } from '@/providers/MainProvider.js';
import { StatusPage, type StatusPageProps } from '@/components/StatusPage/StatusPage.js';

export type ErrorStatusPageError =
  | UseGqlError
  | ['server', UseGqlError]
  | ['init', timeout: number]
  | ['iframe', timeout?: boolean]
  | ['init-data-missing']
  | ['config-invalid', error: ValiError<any>];

function EnhancedStatusPage(props: Pick<StatusPageProps, 'title' | 'text'>) {
  return <StatusPage state="error" {...props} />;
}

/**
 * Component used to handle all kinds of errors.
 */
export function ErrorStatusPage(props: {
  error: ErrorStatusPageError;
  onRetry?: () => void;
}) {
  function withError<T>(fn: (
    err:
      | ['server', UseGqlError]
      | ['init', timeout: number]
      | ['iframe', timeout?: boolean]
      | ['init-data-missing']
      | ['unknown', error: Error]
      | ['config-invalid', error: ValiError<any>],
  ) => T): T {
    const { error } = props;
    return fn(Array.isArray(error)
      ? error
      : GraphQLError.is(error)
        ? ['server', error]
        : ['unknown', error]);
  }

  const t = useTranslator({
    en: {
      apiMessage: 'Server returned error: {{error}}',
      apiTimeoutMessage: 'Couldn\'t get information about the app (timed out {{time}}ms)',
      appUnknownMessage: 'An unknown error occurred while loading the application',
      configInvalidTitle: 'Launcher config invalid',
      defaultMessage: 'Unknown error occurred{{ error }}',
      defaultTitle: 'Something went wrong',
      initDataMissingMessage: 'It is the most likely that the application was launched improperly',
      initDataMissingTitle: 'Init data is missing',
      loadTimeoutMessage: 'The app took too long to load',
      requestMessage: 'Sneding request error: {{error}}',
      tryAgain: 'Try again',
    },
    ru: {
      apiMessage: 'Сервер вернул ошибку: {{error}}',
      apiTimeoutMessage: 'Не удалось получить информацию о приложении (тайм-аут {{time}}мс)',
      appUnknownMessage: 'Произошла неизвестная ошибка при загрузке приложения',
      configInvalidTitle: 'Конфигурация лаунчера некорректна',
      defaultMessage: 'Произошла неизвестная ошибка{{ error }}',
      defaultTitle: 'Что-то пошло не так',
      initDataMissingMessage: 'Скорее всего приложение было запущено некорректно',
      initDataMissingTitle: 'Данные инициализации отсутствуют',
      loadTimeoutMessage: 'Загрузка приложения оказалась слишком долгой',
      requestMessage: 'Ошибка отправки запроса: {{error}}',
      tryAgain: 'Попробовать снова',
    },
  });
  const defaultTitle = t('defaultTitle');

  createEffect(() => {
    const { onRetry } = props;
    if (onRetry) {
      setMainButtonParams({ isVisible: true, text: t('tryAgain') });
      const offClick = onMainButtonClick(onRetry);
      onCleanup(() => {
        setMainButtonParams({ isVisible: false });
        offClick();
      });
    }
  });

  return (
    <Switch>
      {/* Invalid config */}
      <Match when={withError(e => e[0] === 'config-invalid' ? e[1] : false)}>
        {$err => (
          <EnhancedStatusPage title={t('configInvalidTitle')} text={$err().message}/>
        )}
      </Match>

      {/* Init data missing */}
      <Match when={withError(e => e[0] === 'init-data-missing')}>
        <EnhancedStatusPage title={t('initDataMissingTitle')} text={t('initDataMissingMessage')}/>
      </Match>

      {/* Server error */}
      <Match when={withError(e => e[0] === 'server' ? e[1] : false)}>
        {$error => (
          <Show
            when={(() => {
              const e = $error();
              return GraphQLError.is(e) ? e : false;
            })()}
            fallback={
              <EnhancedStatusPage
                title={defaultTitle}
                text={t('requestMessage', { error: $error().message })}
              />
            }
          >
            {$$error => {
              const $code = createMemo(() => {
                const { extensions } = $$error();
                return is(looseObject({ errorData: looseObject({ code: string() }) }), extensions)
                  ? extensions.errorData.code
                  : false;
              });

              return (
                <EnhancedStatusPage
                  title={defaultTitle}
                  text={
                    <>
                      {t('apiMessage', { error: $$error().message })}
                      <Show when={$code()}>
                        &nbsp;
                        <TypographyIos component="span" weight="semibold">
                          ({$code()})
                        </TypographyIos>
                      </Show>
                    </>
                  }
                />
              );
            }}
          </Show>
        )}
      </Match>

      {/* Init error */}
      <Match when={withError(e => e[0] === 'init' ? e[1] : false)}>
        {$timeout => (
          <EnhancedStatusPage
            title={defaultTitle}
            text={t('apiTimeoutMessage', { time: $timeout() })}
          />
        )}
      </Match>

      {/* Application load error */}
      <Match when={withError(e => e[0] === 'iframe' ? [e[1]] : false)}>
        {$tuple => (
          <EnhancedStatusPage
            title={defaultTitle}
            text={t($tuple()[0] ? 'loadTimeoutMessage' : 'appUnknownMessage')}
          />
        )}
      </Match>

      {/* Unknown error */}
      <Match when={withError(e => e[0] === 'unknown' ? e[1] : false)}>
        {$error => (
          <EnhancedStatusPage
            title={defaultTitle}
            text={(() => {
              const error = $error();
              return t('defaultMessage', { error: error instanceof Error ? `: ${error.message}` : '' });
            })()}
          />
        )}
      </Match>
    </Switch>
  );
}