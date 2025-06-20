export function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return; // Prevent SSR errors

  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

export function getCookie(name: string) {
  if (typeof document === "undefined") return ""; // Prevent SSR errors

  return document.cookie.split("; ").reduce((r, v) => {
    const parts = v.split("=");
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, "");
}

export function eraseCookie(name: string) {
  setCookie(name, "", -1);
}
