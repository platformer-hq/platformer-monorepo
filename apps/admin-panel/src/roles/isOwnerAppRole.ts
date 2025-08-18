import { AppRole } from 'schema';

/**
 * @returns True if the passed role is considered as the owner role.
 * @param role - app role.
 */
export function isOwnerAppRole(role: AppRole): boolean {
  return role === AppRole.Owner;
}
