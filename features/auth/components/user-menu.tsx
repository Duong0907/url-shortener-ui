"use client";

import { useEffect } from "react";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
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
      <nav className="flex items-center gap-2">
        <Link href="/login" className={buttonVariants({ variant: "ghost" })}>
          Log in
        </Link>
        <Link href="/register" className={buttonVariants()}>
          Sign up
        </Link>
      </nav>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Typography as="span" variant="small" className="text-muted-foreground">
        {email}
      </Typography>
      <Button variant="outline" onClick={logout}>
        Log out
      </Button>
    </div>
  );
}
