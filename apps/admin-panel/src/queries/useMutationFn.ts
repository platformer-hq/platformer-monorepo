import type { TypedDocumentNode } from 'schema';

import { useGqlRequest } from './useGqlRequest.js';

export function useMutationFn<D, V extends object>(document: TypedDocumentNode<D, V>) {
  const request = useGqlRequest();
  return (variables: V) => request(document, variables);
}
