import { refreshSession, useAuth } from "@/features/auth/store";

type Init = Omit<RequestInit, "headers"> & { headers?: Record<string, string> };

const withToken = (init: Init | undefined, token: string): Init => ({
  ...init,
  headers: { ...init?.headers, Authorization: `Bearer ${token}` },
});

// Sends the access token when signed in. A 401 refreshes the session once and retries once.
export async function authedFetch(path: string, init?: Init): Promise<Response> {
  const token = useAuth.getState().token;
  if (!token) return fetch(path, init);

  const response = await fetch(path, withToken(init, token));

  if (response.status !== 401) return response;

  const newToken = await refreshSession();

  return newToken ? fetch(path, withToken(init, newToken)) : response;
}
