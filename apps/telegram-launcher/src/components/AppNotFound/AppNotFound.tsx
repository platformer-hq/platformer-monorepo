import { LauncherError } from '@/components/LauncherError/LauncherError.js';

export function AppNotFound() {
  return (
    <LauncherError
      title="App not found"
      subtitle="This application doesn't exist or was hidden by the owner"
    />
  );
}