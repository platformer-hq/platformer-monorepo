import type { AsyncOptions } from '@telegram-apps/sdk-solid';
import { AbortablePromise, type PromiseExecutorContext } from 'better-promises';
import {
  array,
  type BaseIssue,
  type BaseSchema,
  type InferOutput,
  looseObject,
  parse,
  string,
  unknown,
  ValiError,
} from 'valibot';

import { GqlError } from '@/api/GqlError.js';
import type { ExecutionFailedTuple, ExecutionTuple } from '@/types/execution.js';
import { maybe } from '@/validation/maybe.js';

interface GqlErrorShape {
  message?: Maybe<string>;
  extensions: {
    errorData: {
      code: string;
    };
  };
}

const GqlResponse = looseObject({
  data: unknown(),
  errors: maybe(array(looseObject({
    message: maybe(string()),
    extensions: looseObject({
      errorData: looseObject({
        code: string(),
      }),
    }),
  }))),
});

export interface GqlRequestOptions extends AsyncOptions {
  authToken?: string;
}

export type GqlRequestError =
  | [type: 'gql', errors: InstanceType<typeof GqlError>[]]
  | [type: 'http', status: number, statusText: string]
  | [type: 'fetch', error: unknown]
  | [type: 'invalid-data', error: Error | ValiError<any>]
  | [type: 'execution', error: Error];

export type GqlRequestResult<T> = ExecutionTuple<T, GqlRequestError>;

function toFailedExecutionTuple<T>(error: T): ExecutionFailedTuple<T> {
  return [false, error];
}

/**
 * Performs a GraphQL request.
 *
 * This function is not throwing errors, but returns them.
 * @param apiBaseURL - URL to send request to.
 * @param query - GraphQL query.
 * @param variables - query variables.
 * @param schema - structure used to validate the response.
 * @param options - additional options.
 */
export function gqlRequest<S extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(
  apiBaseURL: string,
  query: string,
  variables: Record<string, unknown>,
  schema: S,
  options?: GqlRequestOptions,
): AbortablePromise<GqlRequestResult<InferOutput<S>>> {
  async function perform(
    context: PromiseExecutorContext<GqlRequestResult<InferOutput<S>>>,
  ): Promise<GqlRequestResult<InferOutput<S>>> {
    let response: Response;
    try {
      const controller = new AbortController();
      context.onAborted(() => {
        !context.isResolved() && controller.abort(context.abortReason());
      });
      response = await fetch(apiBaseURL, {
        signal: controller.signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `jwt ${(options || {}).authToken}`,
        },
        body: JSON.stringify({ query, variables }),
      });
    } catch (e) {
      return toFailedExecutionTuple(['fetch', e]);
    }

    let data: { data?: unknown; errors?: Maybe<GqlErrorShape[]> } | undefined | void;
    let err: Error | undefined;
    if ((response.headers.get('content-type') || '').includes('application/json')) {
      data = await response.json().then(j => parse(GqlResponse, j)).catch(e => {
        err = e;
      });
    }

    if (!data) {
      return toFailedExecutionTuple(
        !response.ok
          ? ['http', response.status, response.statusText]
          : ['invalid-data', err!],
      );
    }

    if (data.errors) {
      return toFailedExecutionTuple(['gql', data.errors.map(e => {
        return new GqlError(e.extensions.errorData.code, e.message || undefined);
      })]);
    }
    try {
      return [true, parse(schema, data.data)];
    } catch (e) {
      return toFailedExecutionTuple(['invalid-data', e as ValiError<any>]);
    }
  }

  return new AbortablePromise<GqlRequestResult<InferOutput<S>>>(
    async (res, _, context) => {
      const retries = 3;
      for (let i = 0; i < retries; i++) {
        const result = await perform(context);
        if (result[0] || i === retries - 1) {
          return res(result);
        }
        // Sleep: 800ms, 1600ms
        await new Promise(res => {
          setTimeout(res, Math.pow(2, i + 3) * 100);
        });
      }
    }, options,
  )
    .catch(e => toFailedExecutionTuple(['execution', e]));
}