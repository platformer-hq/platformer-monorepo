/* eslint-disable */
import type * as Types from 'schema';

import type { TypedDocumentNode as DocumentNode } from 'schema';
import { gql } from 'schema';
export type AuthenticateMutationVariables = Types.Exact<{
  initData: Types.Scalars['String']['input'];
}>;


export type AuthenticateMutation = { __typename?: 'Mutation', authenticateTelegram: { __typename?: 'JWT', token: string, expiresAt: string } };


export const Authenticate = gql`
    mutation Authenticate($initData: String!) {
  authenticateTelegram(initData: $initData) {
    token
    expiresAt
  }
}
    ` as unknown as DocumentNode<AuthenticateMutation, AuthenticateMutationVariables>;