import { Suspense } from "react";
import type { Metadata } from "next";

import { MyLinks } from "@/features/links/my-links";

export const metadata: Metadata = { title: "My links · URL Shortener" };

// useSearchParams needs a Suspense boundary so the rest of the page can prerender.
export default function LinksPage() {
  return (
    <Suspense>
      <MyLinks />
    </Suspense>
  );
}
