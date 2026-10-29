"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { AppShell } from "@/components/app-shell/app-shell";
import { refreshSession, useAuth } from "@/features/auth/store";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const status = useAuth((s) => s.status);
  const router = useRouter();
  const wasAuthed = useRef(false);

  // After log in the session is already set, so only a fresh page load needs a refresh.
  useEffect(() => {
    if (useAuth.getState().status === "loading") refreshSession();
  }, []);

  // One owner for redirects: after log out (or an ended session) go home, else go to log in.
  useEffect(() => {
    if (status === "authed") wasAuthed.current = true;
    if (status === "anon") router.replace(wasAuthed.current ? "/" : "/login");
  }, [status, router]);

  return <AppShell>{status === "authed" ? children : null}</AppShell>;
}
