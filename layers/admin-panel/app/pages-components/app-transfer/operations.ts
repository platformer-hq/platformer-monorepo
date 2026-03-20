/* eslint-disable */
import type * as Types from '#layers/api/schema';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type AppTransferPageDataQueryVariables = Types.Exact<{
  appId: Types.Scalars['ID']['input'];
}>;


export type AppTransferPageDataQuery = { __typename?: 'Query', currentUser: { __typename?: 'CurrentUser', id: number }, app?: { __typename?: 'App', currentUserRole: Types.AppRole, transferRequest?: { __typename?: 'AppTransferRequest', id: number, to: { __typename?: 'User', id: number, name: string } } | null } | null };

export type RevokeAppTransferRequestMutationVariables = Types.Exact<{
  requestId: Types.Scalars['ID']['input'];
}>;


export type RevokeAppTransferRequestMutation = { __typename?: 'Mutation', revokeAppTransferRequest: boolean };


export const AppTransferPageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AppTransferPageData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"appId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"app"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"appID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"appId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUserRole"}},{"kind":"Field","name":{"kind":"Name","value":"transferRequest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"to"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<AppTransferPageDataQuery, AppTransferPageDataQueryVariables>;
export const RevokeAppTransferRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RevokeAppTransferRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"requestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"revokeAppTransferRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"requestID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"requestId"}}}]}]}}]} as unknown as DocumentNode<RevokeAppTransferRequestMutation, RevokeAppTransferRequestMutationVariables>;