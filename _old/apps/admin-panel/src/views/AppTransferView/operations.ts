/* eslint-disable */
import type * as Types from 'schema';

import type { TypedDocumentNode as DocumentNode } from 'schema';
import { gql } from 'schema';
export type RevokeTransferMutationVariables = Types.Exact<{
  requestID: Types.Scalars['ID']['input'];
}>;


export type RevokeTransferMutation = { __typename?: 'Mutation', revokeAppTransferRequest: boolean };

export type CreateTransferRequestMutationVariables = Types.Exact<{
  appID: Types.Scalars['ID']['input'];
  toUserID: Types.Scalars['ID']['input'];
}>;


export type CreateTransferRequestMutation = { __typename?: 'Mutation', createAppTransferRequest: { __typename?: 'AppTransferRequest', id: number, from: { __typename?: 'User', id: number, name: string }, to: { __typename?: 'User', id: number, name: string } } };

export type AppTransferViewDataQueryVariables = Types.Exact<{
  appID: Types.Scalars['ID']['input'];
}>;


export type AppTransferViewDataQuery = { __typename?: 'Query', app?: { __typename?: 'App', currentUserRole: Types.AppRole, transferRequest?: { __typename?: 'AppTransferRequest', id: number, to: { __typename?: 'User', id: number, name: string } } | null } | null };


export const RevokeTransfer = gql`
    mutation RevokeTransfer($requestID: ID!) {
  revokeAppTransferRequest(requestID: $requestID)
}
    ` as unknown as DocumentNode<RevokeTransferMutation, RevokeTransferMutationVariables>;
export const CreateTransferRequest = gql`
    mutation CreateTransferRequest($appID: ID!, $toUserID: ID!) {
  createAppTransferRequest(appID: $appID, toUserID: $toUserID) {
    id
    from {
      id
      name
    }
    to {
      id
      name
    }
  }
}
    ` as unknown as DocumentNode<CreateTransferRequestMutation, CreateTransferRequestMutationVariables>;
export const AppTransferViewData = gql`
    query AppTransferViewData($appID: ID!) {
  app(appID: $appID) {
    currentUserRole
    transferRequest {
      to {
        id
        name
      }
      id
    }
  }
}
    ` as unknown as DocumentNode<AppTransferViewDataQuery, AppTransferViewDataQueryVariables>;