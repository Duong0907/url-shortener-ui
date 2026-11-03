import type { Metadata } from "next";

import { AuthForm } from "@/features/auth/components/auth-form";
import { safeNext } from "@/features/auth/next-path";

export const metadata: Metadata = { title: "Sign up · Fast Shortener" };

export default async function RegisterPage({ searchParams }: PageProps<"/register">) {
  const { next } = await searchParams;

  return (
    <main>
      <AuthForm mode="register" next={safeNext(next)} />
    </main>
  );
}
