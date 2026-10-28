import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/store";

// Auth pages are for signed-out users; signed-in users go to the app.
// Returns the status so callers can wait for the session check.
export function useRedirectIfSignedIn() {
  const status = useAuth((s) => s.status);
  const router = useRouter();

  useEffect(() => {
    if (status === "authed") router.replace("/app/shorten");
  }, [status, router]);

  return status;
}
