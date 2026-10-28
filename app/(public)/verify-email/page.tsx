import type { Metadata } from "next";

import { VerifyEmail } from "@/features/auth/components/verify-email";

export const metadata: Metadata = { title: "Verify email · URL Shortener" };

export default async function VerifyEmailPage({ searchParams }: PageProps<"/verify-email">) {
  const { token } = await searchParams;
  const resolvedToken = typeof token === "string" && token ? token : null;

  return (
    <main>
      <VerifyEmail token={resolvedToken} />
    </main>
  );
}
