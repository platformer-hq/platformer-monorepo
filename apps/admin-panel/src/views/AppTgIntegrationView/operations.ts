import type * as Types from 'schema';

import type { TypedDocumentNode as DocumentNode } from 'schema';
import { gql } from 'schema';
export type AppTgIntegrationViewDataQueryVariables = Types.Exact<{
  appID: Types.Scalars['ID']['input'];
}>;

export type AppTgIntegrationViewDataQuery = { __typename?: 'Query'; app?: { __typename?: 'App'; currentUserRole: Types.AppRole; telegramBotID?: number | null; telegramProxyLaunchParams: boolean } | null };

export type UpdateAppTelegramDataMutationVariables = Types.Exact<{
  appID: Types.Scalars['ID']['input'];
  telegramBotID?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  telegramProxyLaunchParams: Types.Scalars['Boolean']['input'];
}>;

export type UpdateAppTelegramDataMutation = { __typename?: 'Mutation'; updateApp: { __typename?: 'App'; telegramProxyLaunchParams: boolean; telegramBotID?: number | null } };

export const AppTgIntegrationViewData = gql`
    query AppTgIntegrationViewData($appID: ID!) {
  app(appID: $appID) {
    currentUserRole
    telegramBotID
    telegramProxyLaunchParams
  }
}
    ` as unknown as DocumentNode<AppTgIntegrationViewDataQuery, AppTgIntegrationViewDataQueryVariables>;
export const UpdateAppTelegramData = gql`
    mutation UpdateAppTelegramData($appID: ID!, $telegramBotID: Int, $telegramProxyLaunchParams: Boolean!) {
  updateApp(
    appID: $appID
    telegramProxyLaunchParams: $telegramProxyLaunchParams
    telegramBotID: $telegramBotID
  ) {
    telegramProxyLaunchParams
    telegramBotID
  }
}
    ` as unknown as DocumentNode<UpdateAppTelegramDataMutation, UpdateAppTelegramDataMutationVariables>;
