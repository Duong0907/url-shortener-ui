"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

import { EmailNotVerifiedError } from "@/features/auth/api";
import { loginUrl } from "@/features/auth/components/auth-callback";
import { DEFAULT_NEXT, safeNext } from "@/features/auth/next-path";
import { hasLoggedOut, loginWithGoogle, useAuth } from "@/features/auth/store";

// Google keeps one config per page, so initialize once even when this remounts.
let initialized = false;

// Google's One Tap prompt for signed-out visitors. The Continue with Google button stays the
// fallback when the prompt is dismissed or fails.
export function GoogleOneTap() {
  const status = useAuth((s) => s.status);
  const router = useRouter();
  const prompted = useRef(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (status !== "anon" || !clientId || hasLoggedOut()) return null;

  const handleReady = () => {
    const id = window.google?.accounts.id;

    if (!id || prompted.current) return;

    prompted.current = true;

    if (!initialized) {
      initialized = true;
      id.initialize({
        client_id: clientId,
        auto_select: true,
        use_fedcm_for_prompt: true,
        cancel_on_tap_outside: false,
        callback: ({ credential }) => {
          // Read now, not at mount: the user may have changed pages since the prompt opened.
          const next = safeNext(new URLSearchParams(window.location.search).get("next"));

          loginWithGoogle(credential).then(
            () => router.replace(next ?? DEFAULT_NEXT),
            (error) => {
              if (error instanceof EmailNotVerifiedError) {
                router.replace(loginUrl("email_not_verified", next));
              } else {
                console.warn("Google One Tap sign-in failed", error);
              }
            },
          );
        },
      });
    }

    id.prompt();
  };

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
      onReady={handleReady}
    />
  );
}
