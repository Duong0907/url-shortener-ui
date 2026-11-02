import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { DEFAULT_NEXT } from "@/features/auth/next-path";
import { useAuth } from "@/features/auth/store";

// Auth pages are for signed-out users; signed-in users go to the app, or back to the page
// that sent them to log in (next, already checked by safeNext).
// Returns the status so callers can wait for the session check.
export function useRedirectIfSignedIn(next?: string) {
  const status = useAuth((s) => s.status);
  const router = useRouter();

  useEffect(() => {
    if (status === "authed") router.replace(next ?? DEFAULT_NEXT);
  }, [status, router, next]);

  return status;
}
