"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "@/components/ui/link";
import { Typography } from "@/components/ui/typography";
import { EmailNotVerifiedError, EmailTakenError, register } from "@/features/auth/api";
import { ResendButton } from "@/features/auth/components/resend-button";
import { login } from "@/features/auth/store";
import { useRedirectIfSignedIn } from "@/features/auth/use-redirect-if-signed-in";

const textsByMode = {
  login: {
    title: "Log in",
    submit: "Log in",
    busy: "Logging in…",
    prompt: "No account yet?",
    other: "Sign up",
    href: "/register",
    autoComplete: "current-password",
  },
  register: {
    title: "Create account",
    submit: "Sign up",
    busy: "Signing up…",
    prompt: "Have an account?",
    other: "Log in",
    href: "/login",
    autoComplete: "new-password",
  },
} as const;

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
      <Card className="w-full max-w-sm">
        <CardHeader>
          <Typography as="h1" variant="h3">
            Check your email
          </Typography>
        </CardHeader>
        <CardContent className="space-y-4">
          <Typography role="status">
            We sent a link to <strong>{sentTo}</strong>.
          </Typography>
          <ResendButton email={sentTo} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <Typography as="h1" variant="h3">
          {text.title}
        </Typography>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              required
              className="h-11"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={loading}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={passwordType}
                autoComplete={text.autoComplete}
                maxLength={72}
                required
                className="h-11 pr-16"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                readOnly={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute inset-y-0 right-2 my-auto"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? "Hide" : "Show"}
              </Button>
            </div>
          </div>
          {mode === "register" && (
            <div className="space-y-1.5">
              <label htmlFor="confirm-password" className="text-sm font-medium">
                Confirm password
              </label>
              <Input
                id="confirm-password"
                type={passwordType}
                autoComplete="new-password"
                maxLength={72}
                required
                className="h-11"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                readOnly={loading}
              />
            </div>
          )}
          {error && (
            <div className="space-y-2">
              <Typography as="p" variant="small" role="alert" className="text-destructive">
                {error.message}
                {error instanceof EmailTakenError && (
                  <>
                    &nbsp;
                    <Link href="/login">Log in instead</Link>
                  </>
                )}
              </Typography>
              {error instanceof EmailNotVerifiedError && <ResendButton key={email} email={email} />}
            </div>
          )}
          <Button type="submit" className="h-11 w-full" disabled={loading}>
            {loading ? text.busy : text.submit}
          </Button>
        </form>
        <Typography as="p" variant="small" className="text-center text-muted-foreground">
          {text.prompt}
          &nbsp;
          <Link href={text.href}>{text.other}</Link>
        </Typography>
      </CardContent>
    </Card>
  );
}
