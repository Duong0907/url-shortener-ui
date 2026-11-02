"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import type { z } from "zod";

import { Form } from "@/components/form/form";
import { FormError } from "@/components/form/form-error";
import { PasswordField } from "@/components/form/password-field";
import { SubmitButton } from "@/components/form/submit-button";
import { fieldLabel, TextField } from "@/components/form/text-field";
import { buttonVariants } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { EmailNotVerifiedError, EmailTakenError, register } from "@/features/auth/api";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { GoogleButton } from "@/features/auth/components/google-button";
import { ResendButton } from "@/features/auth/components/resend-button";
import { loginSchema, registerSchema, type AuthValues } from "@/features/auth/schemas";
import { login } from "@/features/auth/store";
import { useRedirectIfSignedIn } from "@/features/auth/use-redirect-if-signed-in";

const textsByMode = {
  login: {
    title: "Log in",
    lead: "Log in to manage your links.",
    submit: "Log in",
    busy: "Logging in…",
    prompt: "No account yet?",
    other: "Sign up",
    href: "/register",
    autoComplete: "current-password",
  },
  register: {
    title: "Create account",
    lead: "Create an account to save your links.",
    submit: "Sign up",
    busy: "Signing up…",
    prompt: "Have an account?",
    other: "Log in",
    href: "/login",
    autoComplete: "new-password",
  },
} as const;

const linkClass = buttonVariants({ variant: "link" });

// Errors /auth/callback passes back from Google. Unknown codes read as a plain failure.
const googleErrors: Record<string, string> = {
  email_not_verified: "Verify your Google email first, or log in with email and password.",
  oauth_failed: "Google sign-in failed. Try again.",
};

// next is the in-app page to return to after login, already checked by safeNext.
export function AuthForm({
  mode,
  next,
  googleError,
}: {
  mode: "login" | "register";
  next?: string;
  googleError?: string;
}) {
  const status = useRedirectIfSignedIn(next);
  const [showPassword, setShowPassword] = useState(false);
  const text = textsByMode[mode];
  const otherHref = next ? `${text.href}?next=${encodeURIComponent(next)}` : text.href;
  const googleMessage = googleError
    ? (googleErrors[googleError] ?? googleErrors.oauth_failed)
    : null;
  const schema: z.ZodType<AuthValues, AuthValues> = mode === "login" ? loginSchema : registerSchema;

  const form = useForm<AuthValues>({
    defaultValues: { email: "", password: "", confirm: "" },
    resolver: zodResolver(schema),
  });
  const { control } = form;
  const email = useWatch({ control, name: "email" });

  const { mutateAsync, isSuccess, variables, error } = useMutation({
    mutationFn: (value: AuthValues) =>
      mode === "login"
        ? login(value.email, value.password)
        : register(value.email, value.password, value.confirm),
  });

  // Register succeeded. Login stays blocked (403) until the user opens the mailed link.
  const sentTo = mode === "register" && isSuccess ? variables.email : null;

  const handleSubmit = (value: AuthValues) => mutateAsync(value).catch(() => {});

  if (sentTo) {
    return (
      <AuthShell
        title="Check your email"
        sheet="Sent"
        aside={
          <Typography role="status" className="text-lg text-pretty text-muted-foreground">
            We sent a link to <strong className="font-semibold text-foreground">{sentTo}</strong>.
            Open it to verify your account, then log in.
          </Typography>
        }
      >
        {/* The answer to this form is the address the link went to, pasted on as tape. */}
        <span className={fieldLabel}>Link sent to</span>
        <span className="animate-tape-print self-start rotate-[-0.6deg] rounded-[3px] bg-tape px-4 py-2.5 font-mono text-lg font-bold break-all text-tape-foreground">
          {sentTo}
        </span>
        <ResendButton email={sentTo} />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={text.title}
      aside={
        <>
          <Typography className="text-lg text-pretty text-muted-foreground">{text.lead}</Typography>
          <Typography className="text-sm">
            {text.prompt}
            &nbsp;
            <Link href={otherHref} className={linkClass}>
              {text.other}
            </Link>
          </Typography>
        </>
      }
    >
      <Form form={form} onSubmit={handleSubmit}>
        <TextField name="email" label="Email" type="email" autoComplete="email" autoFocus />
        <PasswordField
          name="password"
          label="Password"
          autoComplete={text.autoComplete}
          maxLength={72}
          shown={showPassword}
          onShownChange={setShowPassword}
        />
        {mode === "register" && (
          <PasswordField
            name="confirm"
            label="Confirm password"
            autoComplete="new-password"
            maxLength={72}
            shown={showPassword}
            toggle={false}
          />
        )}

        <FormError error={error ?? googleMessage}>
          {error instanceof EmailTakenError && (
            <Link href="/login" className={linkClass}>
              Log in instead
            </Link>
          )}
          {error instanceof EmailNotVerifiedError && <ResendButton key={email} email={email} />}
        </FormError>

        <SubmitButton size="lg" className="w-full" busy={text.busy} pending={status === "authed"}>
          {text.submit}
        </SubmitButton>

        <span className="flex items-center gap-3 font-mono text-xs text-muted-foreground uppercase before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
          or
        </span>
        <GoogleButton next={next} />
      </Form>
    </AuthShell>
  );
}
