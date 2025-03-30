import { TypedErrorStatusPage } from '@/components/TypedErrorStatusPage/TypedErrorStatusPage.js';

/**
 * Error boundary used in the application's root.
 */
export function RootErrorBoundary(error: unknown) {
  return <TypedErrorStatusPage error={['unknown', error]}/>;
}