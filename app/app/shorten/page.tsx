import type { Metadata } from "next";

import { ShortenForm } from "@/features/shorten/shorten-form";

export const metadata: Metadata = { title: "Shorten · URL Shortener" };

export default function ShortenPage() {
  return <ShortenForm />;
}
