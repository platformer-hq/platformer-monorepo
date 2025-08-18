import type * as Types from 'schema';

import type { TypedDocumentNode as DocumentNode } from 'schema';
import { gql } from 'schema';
export type TestGroupEditorViewDataQueryVariables = Types.Exact<{ [key: string]: never }>;

export type TestGroupEditorViewDataQuery = { __typename?: 'Query'; platforms: Array<{ __typename?: 'Platform'; id: number; name: string; completeTitle: string }> };

export const TestGroupEditorViewData = gql`
    query TestGroupEditorViewData {
  platforms {
    id
    name
    completeTitle
  }
}
    ` as unknown as DocumentNode<TestGroupEditorViewDataQuery, TestGroupEditorViewDataQueryVariables>;
