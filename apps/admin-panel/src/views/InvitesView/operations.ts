import type * as Types from 'schema';

import type { TypedDocumentNode as DocumentNode } from 'schema';
import { gql } from 'schema';
export type DataQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type DataQuery = { __typename?: 'Query', currentUser: { __typename?: 'CurrentUser', managementInvites: Array<{ __typename?: 'AppManagementInvite', id: number, role: Types.AppManagementInviteRole, from: { __typename?: 'User', id: number, name: string }, app: { __typename?: 'App', id: number, title: string } }> } };

export type RespondMutationVariables = Types.Exact<{
  inviteID: Types.Scalars['ID']['input'];
  accept: Types.Scalars['Boolean']['input'];
}>;


export type RespondMutation = { __typename?: 'Mutation', respondAppManagementInvite: boolean };


export const Data = gql`
    query Data {
  currentUser {
    managementInvites {
      id
      from {
        id
        name
      }
      role
      app {
        id
        title
      }
    }
  }
}
    ` as unknown as DocumentNode<DataQuery, DataQueryVariables>;
export const Respond = gql`
    mutation Respond($inviteID: ID!, $accept: Boolean!) {
  respondAppManagementInvite(inviteID: $inviteID, accept: $accept)
}
    ` as unknown as DocumentNode<RespondMutation, RespondMutationVariables>;