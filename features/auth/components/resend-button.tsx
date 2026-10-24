"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { resendVerification } from "@/features/auth/api";

export function ResendButton({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function send() {
    setState("sending");
    setError(null);

    try {
      await resendVerification(email.trim());
      setState("sent");
    } catch (err) {
      setError((err as Error).message);
      setState("idle");
    }
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        className="h-11 w-full"
        disabled={state !== "idle" || !email.trim()}
        onClick={send}
      >
        {state === "sending" ? "Sending…" : "Resend email"}
      </Button>
      {state === "sent" && (
        // Each resend kills the previous link, so point users at the newest mail.
        <Typography as="p" variant="small" role="status" className="text-muted-foreground">
          Sent. Check your inbox. Use the link in the newest email.
        </Typography>
      )}
      {error && (
        <Typography as="p" variant="small" role="alert" className="text-destructive">
          {error}
        </Typography>
      )}
    </div>
  );
}
