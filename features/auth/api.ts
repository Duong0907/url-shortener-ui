const GENERIC = "Something went wrong. Try again";

// Same-origin fetch sends the refresh_token cookie by default.
async function post(path: string, body?: unknown): Promise<Response> {
  try {
    return await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error("Can't reach server");
  }
}

async function accessToken(res: Response): Promise<string> {
  return ((await res.json()) as { accessToken: string }).accessToken;
}

export async function register(email: string, password: string): Promise<void> {
  const res = await post("/api/auth/register", { email, password });
  if (res.status === 409) throw new Error("That email is already registered");
  if (res.status === 400) throw new Error("Check your email and password");
  if (!res.ok) throw new Error(GENERIC);
}

export async function login(email: string, password: string): Promise<string> {
  const res = await post("/api/auth/login", { email, password });
  if (res.status === 401) throw new Error("Wrong email or password");
  if (!res.ok) throw new Error(GENERIC);
  return accessToken(res);
}

// Returns null when there is no valid session.
export async function refresh(): Promise<string | null> {
  const res = await post("/api/auth/refresh");
  return res.ok ? accessToken(res) : null;
}

export async function logout(): Promise<void> {
  await post("/api/auth/logout");
}

// Reads the email claim. No signature check: the backend verifies the token.
export function emailFromToken(token: string): string | null {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload)).email ?? null;
  } catch {
    return null;
  }
}
