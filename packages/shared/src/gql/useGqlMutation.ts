import type { DocumentNode } from 'api';

import { hapticFeedbackNotificationOccurred } from '@telegram-apps/sdk-solid';

import { useGqlQuery, type UseGqlQueryOptions } from './useGqlQuery.js';

export type UseGqlMutationOptions<D extends object, V extends object> =
  Omit<UseGqlQueryOptions<D, V>, 'freshAge' | 'staleAge'>;

export function useGqlMutation<D extends object, V extends object>(
  query: DocumentNode<D, V>,
  options?: UseGqlMutationOptions<D, V>,
) {
  options ||= {};
  const { onReady, onErrored } = options;
  return useGqlQuery<D, V>(query, undefined, {
    ...options,
    onReady(...args) {
      hapticFeedbackNotificationOccurred('success');
      onReady && onReady(...args);
    },
    onErrored(...args) {
      hapticFeedbackNotificationOccurred('error');
      onErrored && onErrored(...args);
    },
    staleAge: 0,
    freshAge: 0,
  });
}