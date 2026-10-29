"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { SectionHeader } from "@/components/ui/section-header";
import { createLink, type LinkResponse } from "@/features/shorten/api";
import { LinkTag } from "@/features/shorten/link-tag";
import { UrlForm } from "@/features/shorten/url-form";

export function ShortenForm() {
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

  return (
    <div className="flex flex-col gap-7">
      <SectionHeader
        title="Long links in. Tidy links out."
        description="Paste any URL. Get a short link you can copy, share and track."
      />
      <UrlForm error={error} onSubmit={shorten} />
      <LinkTag key={shortenCount} link={link} />
    </div>
  );
}
