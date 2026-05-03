/* eslint-disable */
import type * as Types from '@workspace/api/schema';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type AppSplashScreenPageDataQueryVariables = Types.Exact<{
  appId: Types.Scalars['ID']['input'];
}>;


export type AppSplashScreenPageDataQuery = { __typename?: 'Query', app?: { __typename?: 'App', splashScreenIconUrl?: string | null } | null };

export type ResetAppSplashScreenIconMutationVariables = Types.Exact<{
  appId: Types.Scalars['ID']['input'];
}>;


export type ResetAppSplashScreenIconMutation = { __typename?: 'Mutation', updateApp: { __typename?: 'App', splashScreenIconUrl?: string | null } };


export const AppSplashScreenPageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AppSplashScreenPageData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"appId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"appID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"appId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"splashScreenIconUrl"}}]}}]}}]} as unknown as DocumentNode<AppSplashScreenPageDataQuery, AppSplashScreenPageDataQueryVariables>;
export const ResetAppSplashScreenIconDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResetAppSplashScreenIcon"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"appId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateApp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"appID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"appId"}}},{"kind":"Argument","name":{"kind":"Name","value":"splashScreenIconSvg"},"value":{"kind":"StringValue","value":"","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"splashScreenIconUrl"}}]}}]}}]} as unknown as DocumentNode<ResetAppSplashScreenIconMutation, ResetAppSplashScreenIconMutationVariables>;