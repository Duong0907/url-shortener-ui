import type { Metadata } from "next";

import { SectionHeader } from "@/components/ui/section-header";

export const metadata: Metadata = { title: "Settings · URL Shortener" };

export default function SettingsPage() {
  return <SectionHeader title="Settings" description="Nothing here yet." />;
}
