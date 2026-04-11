/* eslint-disable */
import type * as Types from '@workspace/api/schema';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type HomePageDataQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type HomePageDataQuery = { __typename?: 'Query', currentUser: { __typename?: 'CurrentUser', id: number, managementInvites: Array<{ __typename: 'AppManagementInvite' }>, appTransferRequests: Array<{ __typename: 'AppTransferRequest' }> } };


export const HomePageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HomePageData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"managementInvites"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"appTransferRequests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]}}]} as unknown as DocumentNode<HomePageDataQuery, HomePageDataQueryVariables>;
