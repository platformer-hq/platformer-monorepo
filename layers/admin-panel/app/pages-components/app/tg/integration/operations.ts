/* eslint-disable */
import type * as Types from '#layers/api/schema';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type AppTgIntegrationPageDataQueryVariables = Types.Exact<{
  appId: Types.Scalars['ID']['input'];
}>;


export type AppTgIntegrationPageDataQuery = { __typename?: 'Query', app?: { __typename?: 'App', currentUserRole: Types.AppRole, telegramBotID?: number | null, telegramProxyLaunchParams: boolean } | null };

export type UpdateAppTelegramDataMutationVariables = Types.Exact<{
  appId: Types.Scalars['ID']['input'];
  telegramBotID?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  telegramProxyLaunchParams: Types.Scalars['Boolean']['input'];
}>;


export type UpdateAppTelegramDataMutation = { __typename?: 'Mutation', updateApp: { __typename?: 'App', telegramProxyLaunchParams: boolean, telegramBotID?: number | null } };


export const AppTgIntegrationPageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AppTgIntegrationPageData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"appId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"appID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"appId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUserRole"}},{"kind":"Field","name":{"kind":"Name","value":"telegramBotID"}},{"kind":"Field","name":{"kind":"Name","value":"telegramProxyLaunchParams"}}]}}]}}]} as unknown as DocumentNode<AppTgIntegrationPageDataQuery, AppTgIntegrationPageDataQueryVariables>;
export const UpdateAppTelegramDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAppTelegramData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"appId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"telegramBotID"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"telegramProxyLaunchParams"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateApp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"appID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"appId"}}},{"kind":"Argument","name":{"kind":"Name","value":"telegramProxyLaunchParams"},"value":{"kind":"Variable","name":{"kind":"Name","value":"telegramProxyLaunchParams"}}},{"kind":"Argument","name":{"kind":"Name","value":"telegramBotID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"telegramBotID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"telegramProxyLaunchParams"}},{"kind":"Field","name":{"kind":"Name","value":"telegramBotID"}}]}}]}}]} as unknown as DocumentNode<UpdateAppTelegramDataMutation, UpdateAppTelegramDataMutationVariables>;