import type { Metadata } from "next";

import { MyLinks } from "@/features/links/my-links";

export const metadata: Metadata = { title: "My links · Fast Shortener" };

export default function LinksPage() {
  return <MyLinks />;
}
