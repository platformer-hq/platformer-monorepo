import { hapticFeedbackNotificationOccurred } from '@telegram-apps/sdk-vue';

import {
  useGqlQuery,
  type UseGqlQueryDocument,
  type UseGqlQueryOptions,
  type UseGqlQueryResult,
} from './useGqlQuery.js';

export type UseGqlMutationDocument<D, V extends object> = UseGqlQueryDocument<D, V>;

export type UseGqlMutationOptions<D, V extends object> =
  Omit<UseGqlQueryOptions<D, V>, 'freshAge' | 'staleAge'>;

export interface UseGqlMutationTriggerFn<D, V> {
  (variables: V): Promise<D>;
}

export interface UseGqlMutationResultUtils<D, V extends object> {
  /**
   * Triggers the mutation.
   */
  trigger: UseGqlMutationTriggerFn<D, V>;
}

export type UseGqlMutationResult<D, V extends object> = [
  UseGqlQueryResult<D, V>[0],
  UseGqlMutationResultUtils<D, V>,
];

export function useGqlMutation<D extends object, V extends object>(
  query: UseGqlMutationDocument<D, V>,
  options?: UseGqlMutationOptions<D, V>,
): UseGqlMutationResult<D, V> {
  options ||= {};
  const { onSuccess } = options;
  const [keyState, { mutate }] = useGqlQuery<D, V>(query, undefined, {
    ...options,
    onSuccess(...args) {
      hapticFeedbackNotificationOccurred('success');
      onSuccess && onSuccess(...args);
    },
    staleAge: 0,
    freshAge: 0,
  });

  return [keyState, {
    trigger(variables) {
      return mutate(variables, undefined, true).promise.then(r => {
        if (r.ok) {
          return r.data;
        }
        throw r.error;
      });
    },
  }];
}
