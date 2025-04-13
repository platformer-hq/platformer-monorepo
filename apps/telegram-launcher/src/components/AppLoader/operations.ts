import type * as Types from 'api';

import type { DocumentNode } from 'api';
import { gql } from 'api';
export type GetAppUrlQueryVariables = Types.Exact<{
  appID: Types.Scalars['Int']['input'];
  launchParams: Types.Scalars['String']['input'];
}>;


export type GetAppUrlQuery = { __typename?: 'Query', appTelegramURL?: string | null };


export const GetAppUrl = gql`
    query GetAppURL($appID: Int!, $launchParams: String!) {
  appTelegramURL(appID: $appID, launchParams: $launchParams)
}
    ` as unknown as DocumentNode<GetAppUrlQuery, GetAppUrlQueryVariables>;