/* eslint-disable */
import type * as Types from '@workspace/api/schema';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type FullAppFunctionDataFragment = {
  __typename?: 'AppFunction',
  id: number,
  enabled: boolean,
  name: string,
  code: string
};

export type AppFunctionsPageDataQueryVariables = Types.Exact<{
  appId: Types.Scalars['ID']['input'];
  funcId: Types.Scalars['ID']['input'];
  skipFuncData: Types.Scalars['Boolean']['input'];
}>;


export type AppFunctionsPageDataQuery = {
  __typename?: 'Query',
  app?: {
    __typename?: 'App',
    currentUserRole: Types.AppRole,
    limits: {
      __typename?: 'AppLimits',
      functions: {
        __typename?: 'AppFunctionLimits',
        maxNameLength?: number | null,
        maxCodeLength?: number | null
      }
    }
  } | null,
  appFunction?: {
    __typename?: 'AppFunction',
    id: number,
    enabled: boolean,
    name: string,
    code: string
  } | null
};

export type DeleteAppFunctionMutationVariables = Types.Exact<{
  funcId: Types.Scalars['ID']['input'];
}>;


export type DeleteAppFunctionMutation = {
  __typename?: 'Mutation',
  deleteAppFunction: boolean
};

export type UpdateAppFunctionMutationVariables = Types.Exact<{
  funcId: Types.Scalars['ID']['input'];
  enabled?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  name?: Types.InputMaybe<Types.Scalars['String']['input']>;
  code?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type UpdateAppFunctionMutation = {
  __typename?: 'Mutation',
  updateAppFunction: {
    __typename?: 'AppFunction',
    id: number,
    enabled: boolean,
    name: string,
    code: string
  }
};

export type CreateAppFunctionMutationVariables = Types.Exact<{
  appId: Types.Scalars['ID']['input'];
  enabled: Types.Scalars['Boolean']['input'];
  name: Types.Scalars['String']['input'];
  code: Types.Scalars['String']['input'];
}>;


export type CreateAppFunctionMutation = {
  __typename?: 'Mutation',
  createAppFunction: {
    __typename?: 'AppFunction',
    id: number,
    enabled: boolean,
    name: string,
    code: string
  }
};


export const AppFunctionsPageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AppFunctionsPageData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"appId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"funcId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skipFuncData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"appID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"appId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUserRole"}},{"kind":"Field","name":{"kind":"Name","value":"limits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"functions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"maxNameLength"}},{"kind":"Field","name":{"kind":"Name","value":"maxCodeLength"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"appFunction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"funcId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"funcId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"skip"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"if"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skipFuncData"}}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]} as unknown as DocumentNode<AppFunctionsPageDataQuery, AppFunctionsPageDataQueryVariables>;
export const DeleteAppFunctionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteAppFunction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"funcId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteAppFunction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"funcId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"funcId"}}}]}]}}]} as unknown as DocumentNode<DeleteAppFunctionMutation, DeleteAppFunctionMutationVariables>;
export const UpdateAppFunctionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAppFunction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"funcId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"enabled"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAppFunction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"funcId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"funcId"}}},{"kind":"Argument","name":{"kind":"Name","value":"enabled"},"value":{"kind":"Variable","name":{"kind":"Name","value":"enabled"}}},{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]} as unknown as DocumentNode<UpdateAppFunctionMutation, UpdateAppFunctionMutationVariables>;
export const CreateAppFunctionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAppFunction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"appId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"enabled"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAppFunction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"appId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"appId"}}},{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}},{"kind":"Argument","name":{"kind":"Name","value":"enabled"},"value":{"kind":"Variable","name":{"kind":"Name","value":"enabled"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]} as unknown as DocumentNode<CreateAppFunctionMutation, CreateAppFunctionMutationVariables>;