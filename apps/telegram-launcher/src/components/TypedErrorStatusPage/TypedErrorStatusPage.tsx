import { createMemo, Match, Show, Switch } from 'solid-js';
import { resolveTemplate, translator } from '@solid-primitives/i18n';
import { type UseGqlError, GraphQLError } from 'solid-gql';
import { TypographyIos } from 'ui';
import { is, looseObject, string } from 'valibot';

import { ErrorStatusPage } from '@/components/ErrorStatusPage/ErrorStatusPage.jsx';
import { useMainContext } from '@/providers/MainProvider.js';

export type TypedErrorStatusPageError =
  | UseGqlError
  | ['init', timeout: number]
  | ['iframe', timeout?: boolean]
  | ['unknown', unknown];

const translations = {
  en: {
    apiTimeout: 'Couldn\'t get information about the app (timed out {{time}}ms)',
    appUnknownError: 'An unknown error occurred while loading the application',
    loadTimeout: 'The app took too long to load',
    title: 'Something went wrong',
    unknownError: 'Unknown error occurred{{ error }}',
  },
  ru: {
    apiTimeout: 'Не удалось получить информацию о приложении (тайм-аут {{time}}мс)',
    appUnknownError: 'Произошла неизвестная ошибка при загрузке приложения',
    loadTimeout: 'Загрузка приложения оказалась слишком долгой',
    title: 'Что-то пошло не так',
    unknownError: 'Произошла неизвестная ошибка{{ error }}',
  },
};

/**
 * Used to handle all kinds of errors.
 */
export function TypedErrorStatusPage(props: { error: TypedErrorStatusPageError }) {
  function withError<T>(
    fn: (
      err:
        | ['init', timeout: number]
        | ['gql', UseGqlError]
        | ['iframe', timeout?: boolean]
        | ['unknown', unknown],
    ) => T,
  ) {
    return () => {
      const { error } = props;
      return fn(Array.isArray(error) ? error : ['gql', error]);
    };
  }

  const { locale } = useMainContext();
  const t = translator(() => translations[locale], resolveTemplate);
  const title = t('title');

  return (
    <Switch>
      {/* GraphQL error */}
      <Match when={withError(e => {
        return e[0] === 'gql' && GraphQLError.is(e[1]) ? e[1] : false;
      })()}>
        {$error => {
          const $code = createMemo(() => {
            const { extensions } = $error();
            return is(looseObject({ errorData: looseObject({ code: string() }) }), extensions)
              ? extensions.errorData.code
              : false;
          });

          return (
            <ErrorStatusPage
              title={title}
              text={
                <>
                  Server returned error:{' '}
                  {$error().message}
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
      </Match>

      {/* Init error */}
      <Match when={withError(e => e[0] === 'init' ? e[1] : false)()}>
        {$timeout => (
          <ErrorStatusPage title={title} text={t('apiTimeout', { time: $timeout() })}/>
        )}
      </Match>

      {/* Application error */}
      <Match when={withError(e => e[0] === 'iframe' ? [e[1]] : false)()}>
        {$tuple => (
          <ErrorStatusPage title={title} text={t($tuple()[0] ? 'loadTimeout' : 'appUnknownError')}/>
        )}
      </Match>

      {/* Unknown error */}
      <Match
        when={withError(e => {
          return e[0] === 'unknown' || (e[0] === 'gql' && !GraphQLError.is(e[0])) ? e[1] : false;
        })()}
      >
        {$error => {
          const message = () => {
            const error = $error();
            return t('unknownError', { error: error instanceof Error ? `: ${error.message}` : '' });
          };
          return <ErrorStatusPage title={title} text={message()}/>;
        }}
      </Match>
    </Switch>
  );
}