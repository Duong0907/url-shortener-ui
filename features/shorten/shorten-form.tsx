"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { FormSheet } from "@/components/form-sheet";
import { SectionHeader } from "@/components/ui/section-header";
import { Typography } from "@/components/ui/typography";
import { createLink, type LinkResponse } from "@/features/shorten/api";
import { FeatureReel } from "@/features/shorten/feature-reel";
import { LinkTag } from "@/features/shorten/link-tag";
import { UrlForm } from "@/features/shorten/url-form";

export function ShortenForm({ variant = "hero" }: { variant?: "hero" | "app" }) {
  const queryClient = useQueryClient();
  // link and error stay in state, not mutation.data/error: a mutation clears both when a new
  // request starts, but the old link or error must stay visible while the next one is pending.
  const [link, setLink] = useState<LinkResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shortenCount, setShortenCount] = useState(0);

  const { mutateAsync } = useMutation({
    mutationFn: ({ url, slug }: { url: string; slug?: string }) => createLink(url, slug),
    onSuccess: (created) => {
      setError(null);
      setLink(created);
      setShortenCount((n) => n + 1);
      // My links should show the new link at once.
      void queryClient.invalidateQueries({ queryKey: ["links"] });
    },
    onError: (err) => {
      setLink(null);
      setError(err.message);
    },
  });

  // Returning the promise keeps the form submitting while the request runs.
  const shorten = (values: { url: string; slug?: string }) =>
    mutateAsync(values).then(
      () => {},
      () => {},
    );

  const formSheet = (
    <FormSheet
      label="Link form"
      meta={`No. ${String(shortenCount + 1).padStart(4, "0")}`}
      className={variant === "hero" ? "@3xl:col-span-7" : undefined}
    >
      <div className="p-6">
        <UrlForm error={error} hasResult={link !== null} onSubmit={shorten} />
      </div>
      <LinkTag key={shortenCount} link={link} />
    </FormSheet>
  );

  if (variant === "app")
    return (
      <>
        <SectionHeader
          title="Shorten"
          description="Paste a long URL to get a short link. Every link you make is saved to My links."
        />
        {formSheet}
      </>
    );

  return (
    // A container query, so the two columns stack when the column is narrow.
    <div className="@container">
      <div className="grid items-start gap-10 @3xl:grid-cols-12 @3xl:gap-12">
        {/* Top-aligned, not centred: the sheet grows when a result prints, and the headline
            must not slide with it. */}
        <header className="flex min-w-0 flex-col gap-5 @3xl:col-span-5 @3xl:pt-10">
          <Typography variant="display">Long links in. Tidy links out.</Typography>
          <Typography className="text-pretty text-muted-foreground">
            Paste any URL. Get a short link you can copy and share.
          </Typography>
          {/* Phones go straight to the form; the reel is for the wide hero only. */}
          <FeatureReel className="mt-4 hidden @3xl:flex" />
        </header>
        {formSheet}
      </div>
    </div>
  );
}
