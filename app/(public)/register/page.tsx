import type { Metadata } from "next";

import { AuthForm } from "@/features/auth/components/auth-form";

export const metadata: Metadata = { title: "Sign up · URL Shortener" };

export default function RegisterPage() {
  return (
    <main>
      <AuthForm mode="register" />
    </main>
  );
}
