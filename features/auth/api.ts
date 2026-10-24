const GENERIC_MESSAGE = "Something went wrong. Try again";

export class EmailTakenError extends Error {
  constructor() {
    super("That email is already registered.");
    this.name = "EmailTakenError";
  }
}

// Right password, but the email is not verified yet.
export class EmailNotVerifiedError extends Error {
  constructor() {
    super("Verify your email first. Check your inbox.");
    this.name = "EmailNotVerifiedError";
  }
}

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

export async function register(
  email: string,
  password: string,
  confirmPassword: string,
): Promise<void> {
  const res = await post("/api/auth/register", { email, password, confirmPassword });

  if (res.status === 409) throw new EmailTakenError();
  if (res.status === 400) throw new Error("Check your email and password");
  if (!res.ok) throw new Error(GENERIC_MESSAGE);
}

export async function login(email: string, password: string): Promise<string> {
  const res = await post("/api/auth/login", { email, password });

  if (res.status === 401) throw new Error("Wrong email or password");
  if (res.status === 403) throw new EmailNotVerifiedError();
  if (!res.ok) throw new Error(GENERIC_MESSAGE);

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

// True when verified. False when the token is unknown, expired, or already used.
export async function verifyEmail(token: string): Promise<boolean> {
  const res = await post("/api/auth/verify-email", { token });

  if (res.status === 400) return false;
  if (!res.ok) throw new Error(GENERIC_MESSAGE);

  return true;
}

// The backend returns 204 even when it sends nothing, so it never reveals which emails exist.
export async function resendVerification(email: string): Promise<void> {
  const res = await post("/api/auth/resend-verification", { email });

  if (res.status === 400) throw new Error("Enter a valid email");
  if (!res.ok) throw new Error(GENERIC_MESSAGE);
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
