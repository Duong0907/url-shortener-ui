import type { Metadata } from "next";

import { AuthCallback } from "@/features/auth/components/auth-callback";

export const metadata: Metadata = { title: "Signing in · URL Shortener" };

export default async function CallbackPage({ searchParams }: PageProps<"/auth/callback">) {
  const { error } = await searchParams;

  return (
    <main>
      <AuthCallback error={typeof error === "string" && error ? error : null} />
    </main>
  );
}
