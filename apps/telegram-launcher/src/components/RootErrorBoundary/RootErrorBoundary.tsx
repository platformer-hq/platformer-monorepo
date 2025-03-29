import { LauncherLoadError } from '@/components/LauncherLoadError/LauncherLoadError.js';

/**
 * Error boundary used in the application's root.
 */
export function RootErrorBoundary(error: unknown) {
  return <LauncherLoadError error={['unknown', error]}/>;
}