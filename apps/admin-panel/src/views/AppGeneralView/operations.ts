/* eslint-disable */
import type * as Types from 'schema';

import type { TypedDocumentNode as DocumentNode } from 'schema';
import { gql } from 'schema';
export type AppGeneralViewDataQueryVariables = Types.Exact<{
  appID: Types.Scalars['ID']['input'];
}>;


export type AppGeneralViewDataQuery = { __typename?: 'Query', app?: { __typename?: 'App', currentUserRole: Types.AppRole, title: string, privacy: Types.AppPrivacy, id: number } | null };

export type UpdateAppMutationVariables = Types.Exact<{
  appID: Types.Scalars['ID']['input'];
  title?: Types.InputMaybe<Types.Scalars['String']['input']>;
  privacy?: Types.InputMaybe<Types.AppPrivacy>;
}>;


export type UpdateAppMutation = { __typename?: 'Mutation', updateApp: { __typename?: 'App', title: string, privacy: Types.AppPrivacy } };


export const AppGeneralViewData = gql`
    query AppGeneralViewData($appID: ID!) {
  app(appID: $appID) {
    currentUserRole
    title
    privacy
    id
  }
}
    ` as unknown as DocumentNode<AppGeneralViewDataQuery, AppGeneralViewDataQueryVariables>;
export const UpdateApp = gql`
    mutation UpdateApp($appID: ID!, $title: String, $privacy: AppPrivacy) {
  updateApp(appID: $appID, title: $title, privacy: $privacy) {
    title
    privacy
  }
}
    ` as unknown as DocumentNode<UpdateAppMutation, UpdateAppMutationVariables>;