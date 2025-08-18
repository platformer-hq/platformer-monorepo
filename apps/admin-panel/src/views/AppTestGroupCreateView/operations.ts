import type * as Types from 'schema';

import type { TypedDocumentNode as DocumentNode } from 'schema';
import { gql } from 'schema';
export type CreateAppTestGroupMutationVariables = Types.Exact<{
  appID: Types.Scalars['ID']['input'];
  title: Types.Scalars['String']['input'];
  enabled: Types.Scalars['Boolean']['input'];
  url: Types.Scalars['String']['input'];
  platformIDs: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
  userIDs: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
}>;

export type CreateAppTestGroupMutation = { __typename?: 'Mutation'; createAppTestGroup: { __typename?: 'AppTestGroup'; id: number; title: string; enabled: boolean; url: string; platforms: Array<{ __typename: 'Platform'; id: number }>; users: Array<{ __typename: 'User'; id: number; name: string }> } };

export const CreateAppTestGroup = gql`
    mutation CreateAppTestGroup($appID: ID!, $title: String!, $enabled: Boolean!, $url: String!, $platformIDs: [ID!]!, $userIDs: [ID!]!) {
  createAppTestGroup(
    title: $title
    enabled: $enabled
    appID: $appID
    url: $url
    platformIDs: $platformIDs
    userIDs: $userIDs
  ) {
    id
    title
    platforms {
      __typename
      id
    }
    enabled
    url
    users {
      __typename
      id
      name
    }
  }
}
    ` as unknown as DocumentNode<CreateAppTestGroupMutation, CreateAppTestGroupMutationVariables>;
