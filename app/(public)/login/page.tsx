import type { Metadata } from "next";

import { AuthForm } from "@/features/auth/components/auth-form";

export const metadata: Metadata = { title: "Log in · URL Shortener" };

export default function LoginPage() {
  return (
    <main>
      <AuthForm mode="login" />
    </main>
  );
}
