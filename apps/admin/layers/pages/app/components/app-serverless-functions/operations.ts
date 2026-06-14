/* eslint-disable */
import type * as Types from '@workspace/api/schema';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type AppServerlessFunctionsQueryVariables = Types.Exact<{
  appId: Types.Scalars['ID']['input'];
}>;


export type AppServerlessFunctionsQuery = { __typename?: 'Query', app?: { __typename?: 'App', currentUserRole: Types.AppRole, limits: { __typename?: 'AppLimits', maxServerlessFunctionsCount?: number | null }, serverlessFunctions: Array<{ __typename?: 'AppServerlessFunction', id: number, name: string, enabled: boolean }> } | null };


export const AppServerlessFunctionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AppServerlessFunctions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"appId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"appID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"appId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUserRole"}},{"kind":"Field","name":{"kind":"Name","value":"limits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"maxServerlessFunctionsCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"serverlessFunctions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}}]}}]}}]} as unknown as DocumentNode<AppServerlessFunctionsQuery, AppServerlessFunctionsQueryVariables>;