import type * as Types from 'schema';

import type { TypedDocumentNode as DocumentNode } from 'schema';
import { gql } from 'schema';
export type FullProfileQueryVariables = Types.Exact<{ [key: string]: never }>;

export type FullProfileQuery = { __typename?: 'Query'; currentUser: { __typename?: 'CurrentUser'; id: number; name: string; telegramData?: { __typename?: 'UserTelegramData'; id?: number | null; firstName: string; lastName?: string | null; login?: string | null } | null } };

export const FullProfile = gql`
    query FullProfile {
  currentUser {
    id
    name
    telegramData {
      id
      firstName
      lastName
      login
    }
  }
}
    ` as unknown as DocumentNode<FullProfileQuery, FullProfileQueryVariables>;
