// src/utils/cookie.ts
import { Preferences } from '@capacitor/preferences';

const SCROLL_KEY = 'scrollpos';

/**
 * Set a value in persistent storage.
 * @param name  The key under which to store the value.
 * @param value The string value to store.
 * @param _days Ignored (left for API compatibility).
 */
export async function setCookie(name: string, value: string, _days = 7): Promise<void> {
  await Preferences.set({ key: name, value });
}

/**
 * Get a value from persistent storage.
 * @param name The key to look up.
 * @returns The stored string, or empty string if not set.
 */
export async function getCookie(name: string): Promise<string> {
  const { value } = await Preferences.get({ key: name });
  return value ?? '';
}

/**
 * Remove a key from persistent storage.
 * @param name The key to remove.
 */
export async function eraseCookie(name: string): Promise<void> {
  await Preferences.remove({ key: name });
}

/**
 * Read the entire scroll-position map from storage.
 * Returns an object mapping page-keys to scroll offsets.
 */
export async function readScrollMap(): Promise<Record<string, number>> {
  const raw = await getCookie(SCROLL_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, number>;
  } catch {
    return {};
  }
}

/**
 * Write the entire scroll-position map back to storage.
 * @param map An object mapping page-keys to scroll offsets.
 */
export async function writeScrollMap(map: Record<string, number>): Promise<void> {
  await setCookie(SCROLL_KEY, JSON.stringify(map));
}
