import type { DocumentNode } from 'api';

import { hapticFeedbackNotificationOccurred } from '@telegram-apps/sdk-solid';

import { useGqlQuerySuspenseless, UseGqlQuerySuspenselessOptions } from './useGqlQuerySuspenseless.js';

export type UseGqlMutationSuspenselessOptions<D extends object, V extends object> =
  Omit<UseGqlQuerySuspenselessOptions<D, V>, 'freshAge' | 'staleAge'>;

export function useGqlMutationSuspenseless<D extends object, V extends object>(
  query: DocumentNode<D, V>,
  options?: UseGqlMutationSuspenselessOptions<D, V>,
) {
  options ||= {};
  const { onSuccess } = options;
  return useGqlQuerySuspenseless<D, V>(query, undefined, {
    ...options,
    onSuccess(...args) {
      hapticFeedbackNotificationOccurred('success');
      onSuccess && onSuccess(...args);
    },
    staleAge: 0,
    freshAge: 0,
  });
}