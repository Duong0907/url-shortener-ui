export const DEFAULT_NEXT = "/app/shorten";

const KEY = "auth:next";

// Only in-app pages. Anything else (another site, a public page) could be an open redirect.
export function safeNext(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;

  return value === "/app" || value.startsWith("/app/") || value.startsWith("/app?")
    ? value
    : undefined;
}

// Google always returns to /auth/callback, so the page to return to waits in this tab.
// Storage can throw (blocked site data); the login still works and lands on the default.
export function saveNext(next: string | undefined): void {
  try {
    if (next) sessionStorage.setItem(KEY, next);
    else sessionStorage.removeItem(KEY);
  } catch {}
}

export function takeNext(): string | undefined {
  try {
    const next = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);

    return safeNext(next);
  } catch {
    return undefined;
  }
}
