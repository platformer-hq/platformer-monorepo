import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

import { hapticFeedbackNotificationOccurred } from '@telegram-apps/sdk-solid';

import { useGqlQuery, type UseGqlQueryOptions } from './useGqlQuery.js';

export type UseGqlMutationOptions<D extends object, V extends object> =
  Omit<UseGqlQueryOptions<D, V>, 'freshAge' | 'staleAge'>;

export function useGqlMutation<D extends object, V extends object>(
  query: TypedDocumentNode<D, V>,
  options?: UseGqlMutationOptions<D, V>,
) {
  options ||= {};
  const { onReady } = options;
  return useGqlQuery<D, V>(query, undefined, {
    ...options,
    onReady(...args) {
      hapticFeedbackNotificationOccurred('success');
      onReady && onReady(...args);
    },
    staleAge: 0,
    freshAge: 0,
  });
}