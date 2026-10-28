"use client";

import { useState } from "react";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { EmailNotVerifiedError, EmailTakenError, register } from "@/features/auth/api";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { ResendButton } from "@/features/auth/components/resend-button";
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
const labelClass = "text-sm leading-none font-medium";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  useRedirectIfSignedIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const text = textsByMode[mode];
  const passwordType = showPassword ? "text" : "password";

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (mode === "register") {
      const problem =
        password.length < 8
          ? "Password needs at least 8 characters"
          : password !== confirm
            ? "Passwords don't match"
            : null;

      if (problem) {
        setError(new Error(problem));
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      if (mode === "login") {
        await login(email.trim(), password);

        // Stay in the loading state;
        // useRedirectIfSignedIn navigates away.
        return;
      }

      await register(email.trim(), password, confirm);

      setSentTo(email.trim());
    } catch (err) {
      setError(err as Error);
    }
    setLoading(false);
  }

  // Register succeeded. Login stays blocked (403) until the user opens the mailed link.
  if (sentTo) {
    return (
      <AuthShell
        title="Check your email"
        aside={
          <Typography role="status" className="text-muted-foreground">
            We sent a link to <strong>{sentTo}</strong>.
          </Typography>
        }
      >
        <ResendButton email={sentTo} />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={text.title}
      aside={
        <>
          <Typography className="text-muted-foreground">{text.lead}</Typography>
          <Typography className="text-sm">
            {text.prompt}
            &nbsp;
            <Link href={text.href} className={linkClass}>
              {text.other}
            </Link>
          </Typography>
        </>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            autoFocus
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly={loading}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={passwordType}
              autoComplete={text.autoComplete}
              maxLength={72}
              required
              className="pr-20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              readOnly={loading}
            />
            <Button
              type="button"
              variant="ghost"
              size="xs"
              className="absolute inset-y-0 right-2 my-auto"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((s) => !s)}
            >
              {showPassword ? "Hide" : "Show"}
            </Button>
          </div>
        </div>
        {mode === "register" && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirm-password" className={labelClass}>
              Confirm password
            </label>
            <Input
              id="confirm-password"
              type={passwordType}
              autoComplete="new-password"
              maxLength={72}
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              readOnly={loading}
            />
          </div>
        )}
        {error && (
          <div className="flex flex-col gap-2">
            <Typography role="alert" className="text-sm text-destructive">
              {error.message}
              {error instanceof EmailTakenError && (
                <>
                  &nbsp;
                  <Link href="/login" className={linkClass}>
                    Log in instead
                  </Link>
                </>
              )}
            </Typography>
            {error instanceof EmailNotVerifiedError && <ResendButton key={email} email={email} />}
          </div>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? text.busy : text.submit}
        </Button>
      </form>
    </AuthShell>
  );
}
