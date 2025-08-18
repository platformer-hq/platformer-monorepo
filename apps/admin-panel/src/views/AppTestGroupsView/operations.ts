import type * as Types from 'schema';

import type { TypedDocumentNode as DocumentNode } from 'schema';
import { gql } from 'schema';
export type AppTestGroupsViewDataQueryVariables = Types.Exact<{
  appID: Types.Scalars['ID']['input'];
}>;


export type AppTestGroupsViewDataQuery = { __typename?: 'Query', app?: { __typename?: 'App', currentUserRole: Types.AppRole, testGroups: Array<{ __typename?: 'AppTestGroup', id: number, title: string, enabled: boolean, users: Array<{ __typename: 'User' }>, platforms: Array<{ __typename: 'Platform' }> }> } | null };


export const AppTestGroupsViewData = gql`
    query AppTestGroupsViewData($appID: ID!) {
  app(appID: $appID) {
    currentUserRole
    testGroups {
      id
      title
      users {
        __typename
      }
      enabled
      platforms {
        __typename
      }
    }
  }
}
    ` as unknown as DocumentNode<AppTestGroupsViewDataQuery, AppTestGroupsViewDataQueryVariables>;