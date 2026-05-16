/* eslint-disable */
import type * as Types from '@workspace/api/schema';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type AppSplashScreenUploadPageDataQueryVariables = Types.Exact<{
  appId: Types.Scalars['ID']['input'];
}>;


export type AppSplashScreenUploadPageDataQuery = { __typename?: 'Query', app?: { __typename?: 'App', splashScreenIconUrl?: string | null } | null, appSplashScreenIconUploadRules: { __typename?: 'AppSplashScreenIconUploadRules', svg: { __typename?: 'AppSplashScreenIconUploadRulesSvg', allowedTags: Array<string>, allowedAttrs: Array<string>, maxSize: number, xmlns: Array<string> } } };

export type UpdateAppSplashScreenIconMutationVariables = Types.Exact<{
  appId: Types.Scalars['ID']['input'];
  svg: Types.Scalars['String']['input'];
}>;


export type UpdateAppSplashScreenIconMutation = { __typename?: 'Mutation', updateApp: { __typename?: 'App', splashScreenIconUrl?: string | null } };


export const AppSplashScreenUploadPageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AppSplashScreenUploadPageData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"appId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"appID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"appId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"splashScreenIconUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"appSplashScreenIconUploadRules"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"svg"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allowedTags"}},{"kind":"Field","name":{"kind":"Name","value":"allowedAttrs"}},{"kind":"Field","name":{"kind":"Name","value":"maxSize"}},{"kind":"Field","name":{"kind":"Name","value":"xmlns"}}]}}]}}]}}]} as unknown as DocumentNode<AppSplashScreenUploadPageDataQuery, AppSplashScreenUploadPageDataQueryVariables>;
export const UpdateAppSplashScreenIconDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAppSplashScreenIcon"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"appId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"svg"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateApp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"appID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"appId"}}},{"kind":"Argument","name":{"kind":"Name","value":"splashScreenIconSvg"},"value":{"kind":"Variable","name":{"kind":"Name","value":"svg"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"splashScreenIconUrl"}}]}}]}}]} as unknown as DocumentNode<UpdateAppSplashScreenIconMutation, UpdateAppSplashScreenIconMutationVariables>;