// import type { DocumentNode } from 'api';
// import type { UseSWRKeyStateWrapped, UseSWRResultUtils } from 'solid-swr';
// import { hapticFeedbackNotificationOccurred } from '@telegram-apps/sdk-solid';

// import {
//   useGqlQuery,
//   type UseGqlQueryOptions,
//   UseGqlQueryParams,
// } from './useGqlQuery.js';
// import type { UseGqlError } from 'solid-gql';

// export type UseGqlMutationOptions<D extends object, V extends object> =
//   Omit<UseGqlQueryOptions<D, V>, 'freshAge' | 'staleAge'>;

// export interface UseGqlMutationSuspenselessTriggerFn<D, V> {
//   (variables: V): Promise<D>;
// }

// export interface UseGqlMutationSuspenselessResultUtils<D, V extends object>
//   extends Pick<UseSWRResultUtils<D, UseGqlQueryParams<V>>, 'mutate'> {
//   /**
//    * Triggers the mutation.
//    */
//   trigger: UseGqlMutationSuspenselessTriggerFn<D, V>;
// }

// export type UseGqlMutationSuspenselessResult<D, V extends object> = [
//   UseSWRKeyStateWrapped<D, UseGqlError>,
//   UseGqlMutationSuspenselessResultUtils<D, V>
// ];

// export function useGqlMutation<D extends object, V extends object>(
//   query: DocumentNode<D, V>,
//   options?: UseGqlMutationOptions<D, V>,
// ): UseGqlMutationSuspenselessResult<D, V> {
//   options ||= {};
//   const { onSuccess } = options;
//   const [keyState, { mutate }] = useGqlQuery<D, V>(query, undefined, {
//     ...options,
//     onSuccess(...args) {
//       hapticFeedbackNotificationOccurred('success');
//       onSuccess && onSuccess(...args);
//     },
//     staleAge: 0,
//     freshAge: 0,
//   });

//   return [keyState, {
//     mutate,
//     trigger(variables) {
//       return mutate(variables, false, true);
//     },
//   }];
// }
export { };
