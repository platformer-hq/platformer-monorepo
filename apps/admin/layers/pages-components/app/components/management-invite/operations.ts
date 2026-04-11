/* eslint-disable */
import type * as Types from '@workspace/api/schema';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type RespondManagementInviteMutationVariables = Types.Exact<{
  inviteId: Types.Scalars['ID']['input'];
  accept: Types.Scalars['Boolean']['input'];
}>;


export type RespondManagementInviteMutation = { __typename?: 'Mutation', respondAppManagementInvite: boolean };


export const RespondManagementInviteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RespondManagementInvite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"inviteId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accept"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"respondAppManagementInvite"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"inviteID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"inviteId"}}},{"kind":"Argument","name":{"kind":"Name","value":"accept"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accept"}}}]}]}}]} as unknown as DocumentNode<RespondManagementInviteMutation, RespondManagementInviteMutationVariables>;
