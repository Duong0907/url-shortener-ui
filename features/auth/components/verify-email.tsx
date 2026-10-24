"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { verifyEmail } from "@/features/auth/api";
import { ResendButton } from "@/features/auth/components/resend-button";
import { useRedirectIfSignedIn } from "@/features/auth/use-redirect-if-signed-in";

// One POST per token per page load. Strict Mode runs effects twice, and a second
// POST would get 400 (token already used) right after a success.
const requests = new Map<string, Promise<boolean>>();

function verifyOnce(token: string): Promise<boolean> {
  let request = requests.get(token);

  if (!request) {
    request = verifyEmail(token);
    requests.set(token, request);
    // Allow a retry after a network or server error.
    request.catch(() => requests.delete(token));
  }

  return request;
}

type State = "verifying" | "verified" | "invalid" | "error";

export function VerifyEmail({ token }: { token: string | null }) {
  const status = useRedirectIfSignedIn();
  const [state, setState] = useState<State>(token ? "verifying" : "invalid");
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [email, setEmail] = useState("");

  // Wait for the session check:
  // a signed-in user is redirected and the token stays unused.
  useEffect(() => {
    if (!token || status !== "anon") return;

    let active = true;

    verifyOnce(token).then(
      (ok) => {
        if (active) setState(ok ? "verified" : "invalid");
      },
      (err: Error) => {
        if (!active) return;
        setError(err.message);
        setState("error");
      },
    );

    return () => {
      active = false;
    };
    // attempt in deps array is for retrying
  }, [token, status, attempt]);

  function retry() {
    setState("verifying");
    setAttempt((a) => a + 1);
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <Typography as="h1" variant="h3">
          Verify email
        </Typography>
      </CardHeader>
      <CardContent className="space-y-4">
        {state === "verifying" && <Typography role="status">Verifying your email…</Typography>}
        {state === "verified" && (
          <>
            <Typography role="status">Email verified</Typography>
            <Link href="/login" className={buttonVariants({ className: "h-11 w-full" })}>
              Log in
            </Link>
          </>
        )}
        {state === "invalid" && (
          <>
            <Typography role="alert" className="text-destructive">
              This link is invalid or has expired.
            </Typography>
            <div className="space-y-1.5">
              <label htmlFor="resend-email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="resend-email"
                type="email"
                autoComplete="email"
                className="h-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <ResendButton key={email} email={email} />
          </>
        )}
        {state === "error" && (
          <>
            <Typography role="alert" className="text-destructive">
              {error}
            </Typography>
            <Button type="button" className="h-11 w-full" onClick={retry}>
              Try again
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
