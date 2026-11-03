import type { Metadata } from "next";

import { ShortenForm } from "@/features/shorten/shorten-form";

export const metadata: Metadata = { title: "Shorten · Fast Shortener" };

export default function ShortenPage() {
  return <ShortenForm variant="app" />;
}
