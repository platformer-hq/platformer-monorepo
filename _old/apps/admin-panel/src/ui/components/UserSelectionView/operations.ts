/* eslint-disable */
import type * as Types from 'schema';

import type { TypedDocumentNode as DocumentNode } from 'schema';
import { gql } from 'schema';
export type SearchUsersQueryVariables = Types.Exact<{
  input: Types.Scalars['String']['input'];
  page: Types.Scalars['Int']['input'];
  excludeUserIDs?: Types.InputMaybe<Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input']>;
  canReceiveAppTransferReq: Types.Scalars['Boolean']['input'];
  canReceiveManagementInvite: Types.Scalars['Boolean']['input'];
}>;


export type SearchUsersQuery = { __typename?: 'Query', searchUsers: Array<{ __typename?: 'User', id: number, name: string }> };


export const SearchUsers = gql`
    query SearchUsers($input: String!, $page: Int!, $excludeUserIDs: [ID!], $canReceiveAppTransferReq: Boolean!, $canReceiveManagementInvite: Boolean!) {
  searchUsers(
    text: $input
    page: $page
    excludeUserIDs: $excludeUserIDs
    canReceiveAppTransferReq: $canReceiveAppTransferReq
    canReceiveManagementInvite: $canReceiveManagementInvite
  ) {
    id
    name
  }
}
    ` as unknown as DocumentNode<SearchUsersQuery, SearchUsersQueryVariables>;