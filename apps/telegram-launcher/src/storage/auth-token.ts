import { parse } from 'valibot';

import { getStorageItem, setStorageItem } from '@/storage/storage.js';
import { AuthToken } from '@/validation/AuthToken.js';

const STORAGE_KEY = '@platformer/auth-token';

/**
 * @returns Platformer authorization token from the safe storage.
 */
export function getAuthTokenFromStorage(): { token: string, expiresAt: Date } | undefined {
  try {
    const json = parse(AuthToken, JSON.parse(getStorageItem(STORAGE_KEY)));
    // Check if the token hasn't expired. We consider it expired if less than 30 seconds left
    // until the expiration date.
    return Date.now() + 30000 <= json.expiresAt.getTime() ? json : undefined;
  } catch (e) { /* empty */
  }
}

/**
 * Saves the project authorization token.
 * @param token - token to save.
 * @param expiresAt - token expiration date.
 */
export function saveAuthTokenToStorage(token: string, expiresAt: Date): void {
  return setStorageItem(STORAGE_KEY, JSON.stringify({
    token,
    expiresAt: expiresAt.toISOString(),
  }));
}