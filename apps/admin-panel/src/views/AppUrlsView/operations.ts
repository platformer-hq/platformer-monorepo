import type * as Types from 'schema';

import type { TypedDocumentNode as DocumentNode } from 'schema';
import { gql } from 'schema';
export type AppUrlsViewDataQueryVariables = Types.Exact<{
  appID: Types.Scalars['ID']['input'];
}>;


export type AppUrlsViewDataQuery = { __typename?: 'Query', app?: { __typename?: 'App', currentUserRole: Types.AppRole, urls: Array<{ __typename?: 'AppURL', url: string, platform: { __typename?: 'Platform', id: number } }> } | null, platforms: Array<{ __typename?: 'Platform', id: number, title: string, name: string, completeTitle: string, vendor: { __typename?: 'PlatformVendor', title: string } }> };

export type SetAppUrlsMutationVariables = Types.Exact<{
  appID: Types.Scalars['ID']['input'];
  urls: Array<Types.InputAppUrl> | Types.InputAppUrl;
}>;


export type SetAppUrlsMutation = { __typename?: 'Mutation', updateApp: { __typename?: 'App', urls: Array<{ __typename?: 'AppURL', url: string, platform: { __typename?: 'Platform', id: number } }> } };


export const AppUrlsViewData = gql`
    query AppUrlsViewData($appID: ID!) {
  app(appID: $appID) {
    currentUserRole
    urls {
      platform {
        id
      }
      url
    }
  }
  platforms {
    id
    title
    name
    completeTitle
    vendor {
      title
    }
  }
}
    ` as unknown as DocumentNode<AppUrlsViewDataQuery, AppUrlsViewDataQueryVariables>;
export const SetAppUrls = gql`
    mutation SetAppUrls($appID: ID!, $urls: [InputAppURL!]!) {
  updateApp(appID: $appID, urls: $urls) {
    urls {
      url
      platform {
        id
      }
    }
  }
}
    ` as unknown as DocumentNode<SetAppUrlsMutation, SetAppUrlsMutationVariables>;