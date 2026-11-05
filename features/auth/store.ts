import { create } from "zustand";

import * as api from "@/features/auth/api";

type AuthState = {
  status: "loading" | "anon" | "authed";
  token: string | null;
  email: string | null;
};

// In memory only. Do not add persist: the token must never reach storage.
export const useAuth = create<AuthState>(() => ({ status: "loading", token: null, email: null }));

function apply(token: string | null) {
  useAuth.setState({
    status: token ? "authed" : "anon",
    token,
    email: token ? api.emailFromToken(token) : null,
  });
}

let pending: Promise<string | null> | null = null;

// One refresh at a time: the backend rotates the cookie, so a parallel call would fail.
export function refreshSession(): Promise<string | null> {
  pending ??= api
    .refresh()
    .catch(() => null)
    .then((token) => {
      apply(token);

      return token;
    })
    .finally(() => {
      pending = null;
    });
  return pending;
}

export async function login(email: string, password: string): Promise<void> {
  apply(await api.login(email, password));
}

export async function loginWithGoogle(credential: string): Promise<void> {
  apply(await api.googleOneTap(credential));
}

let loggedOut = false;

// True after the user logs out in this page load. One Tap stays hidden until a reload.
export function hasLoggedOut(): boolean {
  return loggedOut;
}

export async function logout(): Promise<void> {
  await api.logout().catch(() => {});
  // Set before the status changes, so One Tap sees it on the anon render.
  loggedOut = true;
  // Without this, One Tap's auto_select signs the user straight back in.
  window.google?.accounts.id.disableAutoSelect();
  apply(null);
}
