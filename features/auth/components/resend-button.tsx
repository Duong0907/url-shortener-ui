"use client";

import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { resendVerification } from "@/features/auth/api";

export function ResendButton({ email }: { email: string }) {
  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationFn: () => resendVerification(email.trim()),
  });

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={isPending || isSuccess || !email.trim()}
        onClick={() => mutate()}
      >
        {isPending ? "Sending…" : "Resend email"}
      </Button>

      {isSuccess && (
        <Typography role="status" className="text-sm text-muted-foreground">
          Sent. Check your inbox. Use the link in the newest email.
        </Typography>
      )}

      {error && (
        <Typography role="alert" className="text-sm text-destructive">
          {error.message}
        </Typography>
      )}
    </div>
  );
}
