import type * as Types from 'schema';

import type { TypedDocumentNode as DocumentNode } from 'schema';
import { gql } from 'schema';
export type AppSubscriptionViewDataQueryVariables = Types.Exact<{
  appId: Types.Scalars['ID']['input'];
}>;

export type AppSubscriptionViewDataQuery = { __typename?: 'Query'; app?: { __typename?: 'App'; subscription?: { __typename?: 'AppSubscription'; autoRenewal: boolean; endsAt: string } | null } | null };

export type CreateSubInvoiceLinkMutationVariables = Types.Exact<{
  appId: Types.Scalars['ID']['input'];
}>;

export type CreateSubInvoiceLinkMutation = { __typename?: 'Mutation'; createAppSubTgInvoice: string };

export type UpdateAppSubAutoRenewalMutationVariables = Types.Exact<{
  appId: Types.Scalars['ID']['input'];
  autoRenew: Types.Scalars['Boolean']['input'];
}>;

export type UpdateAppSubAutoRenewalMutation = { __typename?: 'Mutation'; updateAppSubAutoRenewal?: boolean | null };

export const AppSubscriptionViewData = gql`
    query AppSubscriptionViewData($appId: ID!) {
  app(appID: $appId) {
    subscription {
      autoRenewal
      endsAt
    }
  }
}
    ` as unknown as DocumentNode<AppSubscriptionViewDataQuery, AppSubscriptionViewDataQueryVariables>;
export const CreateSubInvoiceLink = gql`
    mutation CreateSubInvoiceLink($appId: ID!) {
  createAppSubTgInvoice(appID: $appId)
}
    ` as unknown as DocumentNode<CreateSubInvoiceLinkMutation, CreateSubInvoiceLinkMutationVariables>;
export const UpdateAppSubAutoRenewal = gql`
    mutation UpdateAppSubAutoRenewal($appId: ID!, $autoRenew: Boolean!) {
  updateAppSubAutoRenewal(appID: $appId, autoRenew: $autoRenew)
}
    ` as unknown as DocumentNode<UpdateAppSubAutoRenewalMutation, UpdateAppSubAutoRenewalMutationVariables>;
