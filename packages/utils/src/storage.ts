/**
 * @returns An item using its key from the storage.
 * @param key - key name.
 */
export function getStorageItem(key: string): string {
  try {
    return localStorage.getItem(key) || '';
  } catch (e) {
    console.error('Unable to use localStorage.getItem', e);
    return '';
  }
}

/**
 * Saves the value in the storage using its key.
 * @param key - key name.
 * @param value - key value.
 */
export function setStorageItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.error('Unable to use localStorage.setItem', e);
  }
}

/**
 * Deletes an item from the storage.
 * @param key - storage key to remove.
 */
export function deleteStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error('Unable to use localStorage.removeItem', e);
  }
}