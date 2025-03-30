import { For, Match, Switch } from 'solid-js';

import type { GqlRequestError } from '@/api/gqlRequest.js';
import { ErrorStatusPage } from '@/components/ErrorStatusPage/ErrorStatusPage.jsx';

export type AppLoadErrorError =
  | GqlRequestError
  | ['iframe', timeout?: boolean]
  | ['unknown', unknown];

/**
 * Used to handle all kinds of errors.
 */
export function TypedErrorStatusPage(props: { error: AppLoadErrorError }) {
  const networkErrTitle = 'Network error';
  const oopsTitle = 'Oops!';

  function withError<T>(fn: (err: AppLoadErrorError) => T) {
    return () => fn(props.error);
  }

  const whenFetch = withError(e => e[0] === 'fetch' ? e[1] : false);
  const whenGql = withError(e => e[0] === 'gql' ? e[1] : false);
  const whenHttp = withError(e => e[0] === 'http' ? [e[1], e[2]] as [number, string] : false);
  const whenInvalidData = withError(e => e[0] === 'invalid-data' ? e[1] : false);
  const whenIframe = withError(e => e[0] === 'iframe' ? [e[1]] : false);
  const whenExecution = withError(e => e[0] === 'execution' ? e[1] : false);
  const whenUnknown = withError(e => e[0] === 'unknown' ? e[1] : false);

  return (
    <Switch>
      <Match when={whenFetch()}>
        <ErrorStatusPage
          title={networkErrTitle}
          text="Unable to send request to the server. The server is unreachable"
        />
      </Match>
      <Match when={whenGql()}>
        {$errors => (
          <ErrorStatusPage
            title={oopsTitle}
            text={
              <>
                Server returned errors:{' '}
                <For each={$errors()}>
                  {($error, idx) => (
                    <>
                      {idx() ? ', ' : ''}{$error.message}&nbsp;
                      <b>({$error.data.code})</b>
                    </>
                  )}
                </For>
              </>
            }
          />
        )}
      </Match>
      <Match when={whenHttp()}>
        {$error => (
          <ErrorStatusPage
            title={networkErrTitle}
            text={`Server responded with status ${$error()[0]}: ${$error()[1]}`}
          />
        )}
      </Match>
      <Match when={whenUnknown()}>
        {$error => {
          const message = () => {
            const error = $error();
            return `Unknown error occurred${error instanceof Error ? `: ${error.message}` : ''}`;
          };
          return <ErrorStatusPage title={oopsTitle} text={message()}/>;
        }}
      </Match>
      <Match when={whenInvalidData()}>
        {$error => (
          <ErrorStatusPage
            title={oopsTitle}
            text={`Server returned unexpected response: ${$error().message}`}
          />
        )}
      </Match>
      <Match when={whenIframe()}>
        {$tuple => (
          <ErrorStatusPage
            title={oopsTitle}
            text={`Application failed to load due to ${$tuple()[0] ? 'timeout' : 'unknown reason'}`}
          />
        )}
      </Match>
      <Match when={whenExecution()}>
        {$error => (
          <ErrorStatusPage
            title={oopsTitle}
            text={`Application failed to load. ${$error().message}`}
          />
        )}
      </Match>
    </Switch>
  );
}