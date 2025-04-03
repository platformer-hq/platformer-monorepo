import type * as Types from '../schema.js';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { gql } from '../gql.js';
export type AuthenticateMutationVariables = Types.Exact<{
  appID?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  initData: Types.Scalars['String']['input'];
}>;


export type AuthenticateMutation = { __typename?: 'Mutation', authenticateTelegram: { __typename?: 'JWT', token: string, expiresAt: string } };


export const Authenticate = gql`
    mutation Authenticate($appID: Int, $initData: String!) {
  authenticateTelegram(appID: $appID, initData: $initData) {
    token
    expiresAt
  }
}
    ` as unknown as DocumentNode<AuthenticateMutation, AuthenticateMutationVariables>;