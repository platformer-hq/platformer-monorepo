/* eslint-disable */
import type * as Types from '@workspace/api/schema';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type AppsPageDataQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type AppsPageDataQuery = { __typename?: 'Query', currentUser: { __typename?: 'CurrentUser', apps: Array<{ __typename?: 'UserManagedApp', role: Types.AppRole, app: { __typename?: 'App', id: number, title: string, privacy: Types.AppPrivacy } }>, limits: { __typename?: 'UserLimits', maxOwnedAppsCount?: number | null } } };


export const AppsPageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AppsPageData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"privacy"}}]}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"Field","name":{"kind":"Name","value":"limits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"maxOwnedAppsCount"}}]}}]}}]}}]} as unknown as DocumentNode<AppsPageDataQuery, AppsPageDataQueryVariables>;
