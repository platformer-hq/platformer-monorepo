/* eslint-disable */
import type * as Types from '#layers/api/schema';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type AppPageDataQueryVariables = Types.Exact<{
  appID: Types.Scalars['ID']['input'];
}>;


export type AppPageDataQuery = { __typename?: 'Query', app?: { __typename?: 'App', currentUserRole: Types.AppRole, id: number, title: string, urlsCacheResetAt?: string | null } | null };

export type DeleteAppMutationVariables = Types.Exact<{
  appID: Types.Scalars['ID']['input'];
}>;


export type DeleteAppMutation = { __typename?: 'Mutation', deleteApp: boolean };


export const AppPageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AppPageData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"appID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"appID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"appID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUserRole"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"urlsCacheResetAt"}}]}}]}}]} as unknown as DocumentNode<AppPageDataQuery, AppPageDataQueryVariables>;
export const DeleteAppDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteApp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"appID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteApp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"appID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"appID"}}}]}]}}]} as unknown as DocumentNode<DeleteAppMutation, DeleteAppMutationVariables>;