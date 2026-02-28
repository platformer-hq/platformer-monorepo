/* eslint-disable */
import type * as Types from '#layers/api/schema';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type PrivacyPageDataQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type PrivacyPageDataQuery = { __typename?: 'Query', currentUser: { __typename?: 'CurrentUser', canAcceptAppTransfers: boolean, canBeInvitedToManage: boolean } };

export type UpdatePermissionsMutationVariables = Types.Exact<{
  canBeInvitedToManage: Types.Scalars['Boolean']['input'];
  canAcceptAppTransfers: Types.Scalars['Boolean']['input'];
}>;


export type UpdatePermissionsMutation = { __typename?: 'Mutation', updateCurrentUser: boolean };


export const PrivacyPageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PrivacyPageData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canAcceptAppTransfers"}},{"kind":"Field","name":{"kind":"Name","value":"canBeInvitedToManage"}}]}}]}}]} as unknown as DocumentNode<PrivacyPageDataQuery, PrivacyPageDataQueryVariables>;
export const UpdatePermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"canBeInvitedToManage"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"canAcceptAppTransfers"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCurrentUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"canBeInvitedToManage"},"value":{"kind":"Variable","name":{"kind":"Name","value":"canBeInvitedToManage"}}},{"kind":"Argument","name":{"kind":"Name","value":"canAcceptAppTransfers"},"value":{"kind":"Variable","name":{"kind":"Name","value":"canAcceptAppTransfers"}}}]}]}}]} as unknown as DocumentNode<UpdatePermissionsMutation, UpdatePermissionsMutationVariables>;