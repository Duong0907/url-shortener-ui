import type { Metadata } from "next";

import { AuthForm } from "@/features/auth/components/auth-form";
import { safeNext } from "@/features/auth/next-path";

export const metadata: Metadata = { title: "Log in · URL Shortener" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next, error } = await searchParams;

  return (
    <main>
      <AuthForm
        mode="login"
        next={safeNext(next)}
        googleError={typeof error === "string" ? error : undefined}
      />
    </main>
  );
}
