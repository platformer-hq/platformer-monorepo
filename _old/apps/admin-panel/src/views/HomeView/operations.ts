/* eslint-disable */
import type * as Types from 'schema';

import type { TypedDocumentNode as DocumentNode } from 'schema';
import { gql } from 'schema';
export type InvitesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type InvitesQuery = { __typename?: 'Query', currentUser: { __typename?: 'CurrentUser', id: number, managementInvites: Array<{ __typename: 'AppManagementInvite' }>, appTransferRequests: Array<{ __typename: 'AppTransferRequest' }> } };


export const Invites = gql`
    query Invites {
  currentUser {
    id
    managementInvites {
      __typename
    }
    appTransferRequests {
      __typename
    }
  }
}
    ` as unknown as DocumentNode<InvitesQuery, InvitesQueryVariables>;