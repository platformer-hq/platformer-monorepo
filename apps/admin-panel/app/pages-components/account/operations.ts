/* eslint-disable */
import type * as Types from '#packages/api/schema';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type AccountPageDataQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type AccountPageDataQuery = { __typename?: 'Query', currentUser: { __typename?: 'CurrentUser', id: number, name: string, telegramData?: { __typename?: 'UserTelegramData', id?: number | null, firstName: string, lastName?: string | null, login?: string | null } | null } };


export const AccountPageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AccountPageData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"telegramData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"login"}}]}}]}}]}}]} as unknown as DocumentNode<AccountPageDataQuery, AccountPageDataQueryVariables>;
