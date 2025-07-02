import { Preferences } from '@capacitor/preferences';

// Set a value (no expiration, as Preferences is persistent)
export async function setCookie(name: string, value: string, _days = 7) {
  await Preferences.set({ key: name, value });
}

// Get a value
export async function getCookie(name: string): Promise<string> {
  const { value } = await Preferences.get({ key: name });
  return value ?? "";
}

// Remove a value
export async function eraseCookie(name: string) {
  await Preferences.remove({ key: name });
}
