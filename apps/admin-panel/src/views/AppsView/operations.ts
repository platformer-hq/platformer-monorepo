/* eslint-disable */
import type * as Types from 'schema';

import type { TypedDocumentNode as DocumentNode } from 'schema';
import { gql } from 'schema';
export type DataQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type DataQuery = { __typename?: 'Query', currentUser: { __typename?: 'CurrentUser', limits: { __typename?: 'UserLimits', maxOwnedAppsCount?: number | null }, apps: Array<{ __typename?: 'UserManagedApp', role: Types.AppRole, app: { __typename?: 'App', id: number, title: string, privacy: Types.AppPrivacy } }> } };


export const Data = gql`
    query Data {
  currentUser {
    limits {
      maxOwnedAppsCount
    }
    apps {
      app {
        id
        title
        privacy
      }
      role
    }
    limits {
      maxOwnedAppsCount
    }
  }
}
    ` as unknown as DocumentNode<DataQuery, DataQueryVariables>;