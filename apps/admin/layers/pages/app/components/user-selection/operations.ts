/* eslint-disable */
import type * as Types from '@workspace/api/schema';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type UserSelectionPageDataQueryVariables = Types.Exact<{
  input: Types.Scalars['String']['input'];
  page: Types.Scalars['Int']['input'];
  excludeUserIDs?: Types.InputMaybe<Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input']>;
  canReceiveAppTransferReq?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  canReceiveManagementInvite?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
}>;


export type UserSelectionPageDataQuery = { __typename?: 'Query', searchUsers: Array<{ __typename?: 'User', id: number, name: string }> };


export const UserSelectionPageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserSelectionPageData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"excludeUserIDs"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"canReceiveAppTransferReq"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"canReceiveManagementInvite"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"excludeUserIDs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"excludeUserIDs"}}},{"kind":"Argument","name":{"kind":"Name","value":"canReceiveAppTransferReq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"canReceiveAppTransferReq"}}},{"kind":"Argument","name":{"kind":"Name","value":"canReceiveManagementInvite"},"value":{"kind":"Variable","name":{"kind":"Name","value":"canReceiveManagementInvite"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UserSelectionPageDataQuery, UserSelectionPageDataQueryVariables>;