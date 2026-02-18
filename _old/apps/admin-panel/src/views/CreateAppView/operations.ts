/* eslint-disable */
import type * as Types from 'schema';

import type { TypedDocumentNode as DocumentNode } from 'schema';
import { gql } from 'schema';
export type CreateAppMutationVariables = Types.Exact<{
  title: Types.Scalars['String']['input'];
}>;


export type CreateAppMutation = { __typename?: 'Mutation', createApp: { __typename?: 'App', id: number, title: string, privacy: Types.AppPrivacy, currentUserRole: Types.AppRole } };


export const CreateApp = gql`
    mutation CreateApp($title: String!) {
  createApp(title: $title) {
    id
    title
    privacy
    currentUserRole
  }
}
    ` as unknown as DocumentNode<CreateAppMutation, CreateAppMutationVariables>;