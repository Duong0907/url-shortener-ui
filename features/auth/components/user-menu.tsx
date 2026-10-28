"use client";

import { useEffect } from "react";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { logout, refreshSession, useAuth } from "@/features/auth/store";

export function UserMenu() {
  const status = useAuth((s) => s.status);
  const email = useAuth((s) => s.email);

  // The header is on every page, so this restores the session once per page load.
  useEffect(() => {
    refreshSession();
  }, []);

  // Render nothing until the session check ends, so signed-in users see no "Log in" flash.
  if (status === "loading") return null;

  if (status === "anon") {
    return (
      <div className="flex items-center gap-2">
        {/* Hidden on phones so the nav fits at 375px; the sign-up page links to log in. */}
        <Link
          href="/login"
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
            className: "hidden sm:inline-flex",
          })}
        >
          Log in
        </Link>
        <Link href="/register" className={buttonVariants({ size: "sm" })}>
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-muted-foreground sm:inline">{email}</span>
      <Button variant="outline" size="sm" onClick={logout}>
        Log out
      </Button>
    </div>
  );
}
