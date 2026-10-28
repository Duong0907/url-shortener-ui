"use client";

import { useState } from "react";

import { SectionHeader } from "@/components/ui/section-header";
import { createLink, type LinkResponse } from "@/features/shorten/api";
import { LinkTag } from "@/features/shorten/link-tag";
import { UrlForm } from "@/features/shorten/url-form";

export function ShortenForm() {
  const [link, setLink] = useState<LinkResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [shortenCount, setShortenCount] = useState(0);

  async function shorten(url: string) {
    setLoading(true);
    try {
      const created = await createLink(url);
      setError(null);
      setLink(created);
      setShortenCount((n) => n + 1);
    } catch (err) {
      setLink(null);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-7">
      <SectionHeader
        title="Long links in. Tidy links out."
        description="Paste any URL. Get a short link you can copy, share and track."
      />
      <UrlForm loading={loading} error={error} onSubmit={shorten} />
      <LinkTag key={shortenCount} link={link} />
    </div>
  );
}
