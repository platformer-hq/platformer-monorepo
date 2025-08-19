/* eslint-disable */
import type * as Types from 'schema';

import type { TypedDocumentNode as DocumentNode } from 'schema';
import { gql } from 'schema';
export type AppUrlViewerViewDataQueryVariables = Types.Exact<{
  appID: Types.Scalars['ID']['input'];
  userID: Types.Scalars['ID']['input'];
}>;


export type AppUrlViewerViewDataQuery = { __typename?: 'Query', userAppURLExplanations: Array<{ __typename?: 'AppURLExplanation', url?: string | null, platform: { __typename?: 'Platform', completeTitle: string }, explanation: { __typename?: 'AppURLSimpleExplanation', kind: Types.AppUrlSimpleExplanationKind } | { __typename?: 'AppURLTestGroupExplanation', id: number, title?: string | null } }> };


export const AppUrlViewerViewData = gql`
    query AppUrlViewerViewData($appID: ID!, $userID: ID!) {
  userAppURLExplanations(appID: $appID, userID: $userID) {
    url
    platform {
      completeTitle
    }
    explanation {
      ... on AppURLSimpleExplanation {
        kind
      }
      ... on AppURLTestGroupExplanation {
        id
        title
      }
    }
  }
}
    ` as unknown as DocumentNode<AppUrlViewerViewDataQuery, AppUrlViewerViewDataQueryVariables>;