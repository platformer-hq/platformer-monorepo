import type * as Types from 'schema';

import type { TypedDocumentNode as DocumentNode } from 'schema';
import { gql } from 'schema';
export type AppViewDataQueryVariables = Types.Exact<{
  appID: Types.Scalars['ID']['input'];
}>;


export type AppViewDataQuery = { __typename?: 'Query', app?: { __typename?: 'App', currentUserRole: Types.AppRole, id: number, title: string, urlsCacheResetAt?: string | null } | null };

export type DeleteAppMutationVariables = Types.Exact<{
  appID: Types.Scalars['ID']['input'];
}>;


export type DeleteAppMutation = { __typename?: 'Mutation', deleteApp: boolean };

export type ResetAppCacheMutationVariables = Types.Exact<{
  appID: Types.Scalars['ID']['input'];
}>;


export type ResetAppCacheMutation = { __typename?: 'Mutation', updateApp: { __typename?: 'App', urlsCacheResetAt?: string | null } };


export const AppViewData = gql`
    query AppViewData($appID: ID!) {
  app(appID: $appID) {
    currentUserRole
    id
    title
    urlsCacheResetAt
  }
}
    ` as unknown as DocumentNode<AppViewDataQuery, AppViewDataQueryVariables>;
export const DeleteApp = gql`
    mutation DeleteApp($appID: ID!) {
  deleteApp(appID: $appID)
}
    ` as unknown as DocumentNode<DeleteAppMutation, DeleteAppMutationVariables>;
export const ResetAppCache = gql`
    mutation ResetAppCache($appID: ID!) {
  updateApp(appID: $appID, urlsCacheReset: true) {
    urlsCacheResetAt
  }
}
    ` as unknown as DocumentNode<ResetAppCacheMutation, ResetAppCacheMutationVariables>;