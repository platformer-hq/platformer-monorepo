/* eslint-disable */
import type * as Types from '#packages/api/schema';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type TransferRequestsPageDataQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type TransferRequestsPageDataQuery = { __typename?: 'Query', currentUser: { __typename?: 'CurrentUser', appTransferRequests: Array<{ __typename?: 'AppTransferRequest', id: number, from: { __typename?: 'User', id: number, name: string }, app: { __typename?: 'App', id: number, title: string } }> } };


export const TransferRequestsPageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TransferRequestsPageData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"appTransferRequests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"from"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"app"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]} as unknown as DocumentNode<TransferRequestsPageDataQuery, TransferRequestsPageDataQueryVariables>;
