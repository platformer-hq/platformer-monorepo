import { AppRole } from 'schema';

import { isOwnerAppRole } from './isOwnerAppRole.js';

/**
 * @returns True if the passed role is considered as an editor role.
 * @param role - app role.
 */
export function isEditorAppRole(role: AppRole): boolean {
  return isOwnerAppRole(role) || role === AppRole.Admin;
}
