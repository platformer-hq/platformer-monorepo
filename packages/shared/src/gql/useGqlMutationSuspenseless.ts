import type { DocumentNode } from 'api';
import type { UseSWRKeyStateWrapped, UseSWRSuspenselessResultUtils } from 'solid-swr';
import { hapticFeedbackNotificationOccurred } from '@telegram-apps/sdk-solid';

import {
  useGqlQuerySuspenseless,
  type UseGqlQuerySuspenselessOptions,
  UseGqlQuerySuspenselessParams,
} from './useGqlQuerySuspenseless.js';
import type { UseGqlSuspenselessError } from 'solid-gql';

export type UseGqlMutationSuspenselessOptions<D extends object, V extends object> =
  Omit<UseGqlQuerySuspenselessOptions<D, V>, 'freshAge' | 'staleAge'>;

export interface UseGqlMutationSuspenselessTriggerFn<D, V> {
  (variables: V): Promise<D>;
}

export interface UseGqlMutationSuspenselessResultUtils<D, V extends object>
  extends Pick<UseSWRSuspenselessResultUtils<D, UseGqlQuerySuspenselessParams<V>>, 'mutate'> {
  /**
   * Triggers the mutation.
   */
  trigger: UseGqlMutationSuspenselessTriggerFn<D, V>;
}

export type UseGqlMutationSuspenselessResult<D, V extends object> = [
  UseSWRKeyStateWrapped<D, UseGqlSuspenselessError>,
  UseGqlMutationSuspenselessResultUtils<D, V>
];

export function useGqlMutationSuspenseless<D extends object, V extends object>(
  query: DocumentNode<D, V>,
  options?: UseGqlMutationSuspenselessOptions<D, V>,
): UseGqlMutationSuspenselessResult<D, V> {
  options ||= {};
  const { onSuccess } = options;
  const [keyState, { mutate }] = useGqlQuerySuspenseless<D, V>(query, undefined, {
    ...options,
    onSuccess(...args) {
      hapticFeedbackNotificationOccurred('success');
      onSuccess && onSuccess(...args);
    },
    staleAge: 0,
    freshAge: 0,
  });

  return [keyState, {
    mutate,
    trigger(variables) {
      return mutate(variables, false, true);
    },
  }];
}