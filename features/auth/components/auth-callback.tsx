"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { Typography } from "@/components/ui/typography";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { DEFAULT_NEXT, takeNext } from "@/features/auth/next-path";
import { refreshSession } from "@/features/auth/store";

// access_denied means the user cancelled at Google, so log in shows no message.
export function loginUrl(error: string | null, next: string | undefined) {
  const query = new URLSearchParams();
  if (error && error !== "access_denied") query.set("error", error);
  if (next) query.set("next", next);
  const search = query.toString();

  return search ? `/login?${search}` : "/login";
}

// Google returns here. On success the backend has set the refresh cookie, so a refresh
// gives the access token.
export function AuthCallback({ error }: { error: string | null }) {
  const router = useRouter();
  const started = useRef(false);

  useEffect(() => {
    // Strict Mode runs effects twice; a second run would find next already taken.
    if (started.current) return;
    started.current = true;
    const next = takeNext();

    if (error) {
      router.replace(loginUrl(error, next));
      return;
    }

    refreshSession().then((token) =>
      router.replace(token ? (next ?? DEFAULT_NEXT) : loginUrl("oauth_failed", next)),
    );
  }, [error, router]);

  return (
    <AuthShell title="Log in" aside={null}>
      <Typography role="status" className="text-muted-foreground">
        Signing you in…
      </Typography>
    </AuthShell>
  );
}
