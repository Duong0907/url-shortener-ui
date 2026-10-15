"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { login, register, useAuth } from "@/features/auth/store";

const copy = {
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
  const status = useAuth((s) => s.status);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const text = copy[mode];

  // Covers both a fresh login and opening this page while signed in.
  useEffect(() => {
    if (status === "authed") router.replace("/");
  }, [status, router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "register" && password.length < 8) {
      setError("Password needs at least 8 characters");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await (mode === "login" ? login : register)(email.trim(), password);
      // Stay in the loading state; the effect above navigates away.
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
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
                type={showPassword ? "text" : "password"}
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
          {error && (
            <Typography as="p" variant="small" role="alert" className="text-destructive">
              {error}
            </Typography>
          )}
          <Button type="submit" className="h-11 w-full" disabled={loading}>
            {loading ? text.busy : text.submit}
          </Button>
        </form>
        <Typography as="p" variant="small" className="text-center text-muted-foreground">
          {text.prompt}{" "}
          <Link href={text.href} className="text-primary underline-offset-4 hover:underline">
            {text.other}
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
}
