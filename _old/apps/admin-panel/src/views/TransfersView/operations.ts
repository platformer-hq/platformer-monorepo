/* eslint-disable */
import type * as Types from 'schema';

import type { TypedDocumentNode as DocumentNode } from 'schema';
import { gql } from 'schema';
export type DataQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type DataQuery = { __typename?: 'Query', currentUser: { __typename?: 'CurrentUser', appTransferRequests: Array<{ __typename?: 'AppTransferRequest', id: number, from: { __typename?: 'User', id: number, name: string }, app: { __typename?: 'App', id: number, title: string } }> } };

export type RespondMutationVariables = Types.Exact<{
  requestID: Types.Scalars['ID']['input'];
  accept: Types.Scalars['Boolean']['input'];
}>;


export type RespondMutation = { __typename?: 'Mutation', respondAppTransferRequest: boolean };


export const Data = gql`
    query Data {
  currentUser {
    appTransferRequests {
      id
      from {
        id
        name
      }
      app {
        id
        title
      }
    }
  }
}
    ` as unknown as DocumentNode<DataQuery, DataQueryVariables>;
export const Respond = gql`
    mutation Respond($requestID: ID!, $accept: Boolean!) {
  respondAppTransferRequest(requestID: $requestID, accept: $accept)
}
    ` as unknown as DocumentNode<RespondMutation, RespondMutationVariables>;