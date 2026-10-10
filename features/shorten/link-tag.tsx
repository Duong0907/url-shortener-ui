"use client";

import { useState } from "react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Typography, typographyVariants } from "@/components/ui/typography";
import type { LinkResponse } from "@/features/shorten/api";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

export function LinkTag({ link }: { link: LinkResponse | null }) {
  return (
    <article
      aria-live="polite"
      className="relative -rotate-2 rounded-2xl border-[1.5px] border-foreground bg-card py-5 pr-5 pl-11 shadow-[6px_6px_0_var(--foreground)] transition-transform duration-300 hover:rotate-0 motion-reduce:transition-none"
    >
      <span
        aria-hidden
        className="absolute top-1/2 left-4 size-3.5 -translate-y-1/2 rounded-full border-[1.5px] border-foreground bg-background"
      />
      <Typography variant="overline">Short link</Typography>
      {link ? (
        <ShortLink link={link} />
      ) : (
        <Typography as="p" variant="code" className="text-muted-foreground">
          your-link
        </Typography>
      )}

      <dl className="mt-4 grid grid-cols-3 gap-4 border-t-[1.5px] border-dashed pt-3 text-sm">
        <Meta label="Created">{link ? fmtDate(link.createdAt) : "—"}</Meta>
        <Meta label="Expires">
          {link ? (link.expiresAt ? fmtDate(link.expiresAt) : "Never") : "—"}
        </Meta>
        <Meta label="Status">{link ? <StatusBadge active={link.active} /> : "—"}</Meta>
      </dl>

      {link && <CopyButton text={link.shortUrl} />}
    </article>
  );
}

function ShortLink({ link }: { link: LinkResponse }) {
  return (
    <a
      href={link.shortUrl}
      aria-label={link.shortUrl}
      target="_blank"
      rel="noreferrer"
      className={cn(
        typographyVariants({ variant: "code", weight: "semibold" }),
        "block underline-offset-4 hover:underline",
      )}
    >
      <span className="font-normal text-muted-foreground">
        {link.shortUrl.slice(0, -link.slug.length)}
      </span>
      {link.slug}
    </a>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Typography as="dt" variant="overline">
        {label}
      </Typography>
      <Typography as="dd" variant="small" weight="semibold" className="tabular-nums">
        {children}
      </Typography>
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold before:size-1.5 before:rounded-full before:bg-current ${
        active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button type="button" variant="outline" className="mt-4 h-10" onClick={copy}>
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}
