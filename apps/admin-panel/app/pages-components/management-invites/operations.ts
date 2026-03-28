/* eslint-disable */
import type * as Types from '#packages/api/schema';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type ManagementInvitesPageDataQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ManagementInvitesPageDataQuery = { __typename?: 'Query', currentUser: { __typename?: 'CurrentUser', managementInvites: Array<{ __typename?: 'AppManagementInvite', id: number, role: Types.AppManagementInviteRole, from: { __typename?: 'User', id: number, name: string }, app: { __typename?: 'App', id: number, title: string } }> } };


export const ManagementInvitesPageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ManagementInvitesPageData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"managementInvites"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"from"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"app"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ManagementInvitesPageDataQuery, ManagementInvitesPageDataQueryVariables>;
