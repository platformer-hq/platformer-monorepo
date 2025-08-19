/* eslint-disable */
import type * as Types from 'schema';

import type { TypedDocumentNode as DocumentNode } from 'schema';
import { gql } from 'schema';
export type TestGroupViewDataQueryVariables = Types.Exact<{
  appID: Types.Scalars['ID']['input'];
  testGroupID: Types.Scalars['ID']['input'];
}>;


export type TestGroupViewDataQuery = { __typename?: 'Query', app?: { __typename?: 'App', currentUserRole: Types.AppRole } | null, appTestGroup: { __typename?: 'AppTestGroup', id: number, title: string, url: string, enabled: boolean, platforms: Array<{ __typename?: 'Platform', id: number }>, users: Array<{ __typename?: 'User', id: number, name: string }> } };

export type DeleteTestGroupMutationVariables = Types.Exact<{
  testGroupID: Types.Scalars['ID']['input'];
}>;


export type DeleteTestGroupMutation = { __typename?: 'Mutation', deleteAppTestGroup: boolean };

export type UpdateTestGroupMutationVariables = Types.Exact<{
  testGroupID: Types.Scalars['ID']['input'];
  title: Types.Scalars['String']['input'];
  enabled: Types.Scalars['Boolean']['input'];
  url: Types.Scalars['String']['input'];
  platformIDs: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
  userIDs: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
}>;


export type UpdateTestGroupMutation = { __typename?: 'Mutation', updateAppTestGroup: { __typename?: 'AppTestGroup', id: number, title: string, enabled: boolean, url: string, platforms: Array<{ __typename: 'Platform', id: number }>, users: Array<{ __typename: 'User', id: number, name: string }> } };


export const TestGroupViewData = gql`
    query TestGroupViewData($appID: ID!, $testGroupID: ID!) {
  app(appID: $appID) {
    currentUserRole
  }
  appTestGroup(testGroupID: $testGroupID) {
    id
    title
    platforms {
      id
    }
    url
    users {
      id
      name
    }
    enabled
  }
}
    ` as unknown as DocumentNode<TestGroupViewDataQuery, TestGroupViewDataQueryVariables>;
export const DeleteTestGroup = gql`
    mutation DeleteTestGroup($testGroupID: ID!) {
  deleteAppTestGroup(testGroupID: $testGroupID)
}
    ` as unknown as DocumentNode<DeleteTestGroupMutation, DeleteTestGroupMutationVariables>;
export const UpdateTestGroup = gql`
    mutation UpdateTestGroup($testGroupID: ID!, $title: String!, $enabled: Boolean!, $url: String!, $platformIDs: [ID!]!, $userIDs: [ID!]!) {
  updateAppTestGroup(
    testGroupID: $testGroupID
    title: $title
    enabled: $enabled
    url: $url
    platformIDs: $platformIDs
    userIDs: $userIDs
  ) {
    id
    title
    platforms {
      __typename
      id
    }
    enabled
    url
    users {
      __typename
      id
      name
    }
  }
}
    ` as unknown as DocumentNode<UpdateTestGroupMutation, UpdateTestGroupMutationVariables>;