import type * as Types from 'api';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { gql } from 'api';
export type GetAppUrlQueryVariables = Types.Exact<{
  appID: Types.Scalars['Int']['input'];
  isExternal?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  launchParams: Types.Scalars['String']['input'];
  reSignInitData?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
}>;


export type GetAppUrlQuery = { __typename?: 'Query', app?: { __typename?: 'App', telegramURL?: string | null } | null };


export const GetAppUrl = gql`
    query GetAppURL($appID: Int!, $isExternal: Boolean, $launchParams: String!, $reSignInitData: Boolean) {
  app(appID: $appID) {
    telegramURL(
      isExternal: $isExternal
      launchParams: $launchParams
      reSignInitData: $reSignInitData
    )
  }
}
    ` as unknown as DocumentNode<GetAppUrlQuery, GetAppUrlQueryVariables>;