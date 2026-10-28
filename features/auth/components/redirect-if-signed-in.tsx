"use client";

import { useRedirectIfSignedIn } from "@/features/auth/use-redirect-if-signed-in";

// The public home page is for signed-out visitors. Signed-in users go to the app.
export function RedirectIfSignedIn() {
  useRedirectIfSignedIn();

  return null;
}
