"use client";

import { useState } from "react";

import { Typography } from "@/components/ui/typography";
import { createLink, type LinkResponse } from "@/features/shorten/api";
import { LinkTag } from "@/features/shorten/link-tag";
import { UrlForm } from "@/features/shorten/url-form";

export function ShortenForm() {
  const [link, setLink] = useState<LinkResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function shorten(url: string) {
    setLoading(true);
    try {
      const created = await createLink(url);
      setError(null);
      setLink(created);
    } catch (err) {
      setLink(null);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-5xl space-y-10">
      <div className="grid items-center gap-10 md:grid-cols-[1.1fr_1fr]">
        <Hero />
        <LinkTag link={link} />
      </div>
      <UrlForm loading={loading} error={error} onSubmit={shorten} />
    </div>
  );
}

function Hero() {
  return (
    <div className="space-y-4">
      <Typography variant="h1" weight="extrabold">
        Long links in.
        <br />
        <span className="text-primary">Tidy tags</span> out.
      </Typography>
      <Typography className="max-w-[42ch] text-muted-foreground">
        Paste any URL. Get a short link you can copy, share and track until it expires.
      </Typography>
    </div>
  );
}
