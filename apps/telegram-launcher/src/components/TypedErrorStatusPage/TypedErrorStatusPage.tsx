import { createMemo, Match, Show, Switch } from 'solid-js';
import { type UseGqlError, GraphQLError } from 'solid-gql';

import { ErrorStatusPage } from '@/components/ErrorStatusPage/ErrorStatusPage.jsx';
import { is, looseObject, string } from 'valibot';

export type TypedErrorStatusPageError =
  | UseGqlError
  | ['iframe', timeout?: boolean]
  | ['unknown', unknown];

/**
 * Used to handle all kinds of errors.
 */
export function TypedErrorStatusPage(props: { error: TypedErrorStatusPageError }) {
  function withError<T>(
    fn: (err: ['gql', UseGqlError] | ['iframe', timeout?: boolean] | ['unknown', unknown]) => T,
  ) {
    return () => {
      const { error } = props;
      return fn(Array.isArray(error) ? error : ['gql', error]);
    };
  }

  const whenGql = withError(e => {
    return e[0] === 'gql' && GraphQLError.is(e[1]) ? e[1] : false;
  });
  const whenIframe = withError(e => e[0] === 'iframe' ? [e[1]] : false);
  const whenUnknown = withError(e => {
    return e[0] === 'unknown' || (e[0] === 'gql' && !GraphQLError.is(e[0])) ? e[1] : false;
  });
  const title = 'Oops!';

  return (
    <Switch>
      <Match when={whenGql()}>
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
                    &nbsp;<b>({$code()})</b>
                  </Show>
                </>
              }
            />
          );
        }}
      </Match>
      <Match when={whenUnknown()}>
        {$error => {
          const message = () => {
            const error = $error();
            return `Unknown error occurred${error instanceof Error ? `: ${error.message}` : ''}`;
          };
          return <ErrorStatusPage title={title} text={message()}/>;
        }}
      </Match>
      <Match when={whenIframe()}>
        {$tuple => (
          <ErrorStatusPage
            title={title}
            text={`Application failed to load due to ${$tuple()[0] ? 'timeout' : 'unknown reason'}`}
          />
        )}
      </Match>
    </Switch>
  );
}