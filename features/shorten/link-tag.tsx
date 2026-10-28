"use client";

import { cn } from "cn";

import { CopyButton } from "@/components/copy-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import type { LinkResponse } from "@/features/shorten/api";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

const eyebrow = "text-xs tracking-wider text-muted-foreground uppercase";

export function LinkTag({ link }: { link: LinkResponse | null }) {
  return (
    <article
      aria-live="polite"
      className={cn(
        link && "animate-in duration-500 fade-in slide-in-from-bottom-2 motion-reduce:animate-none",
      )}
    >
      <Card>
        <Typography className={eyebrow}>Short link</Typography>
        {link ? (
          <ShortLink link={link} />
        ) : (
          <Typography as="p" variant="h3" className="text-muted-foreground">
            your-link
          </Typography>
        )}

        <dl className="grid grid-cols-3 gap-4 border-t border-border pt-3">
          <Meta label="Created">{link ? fmtDate(link.createdAt) : "—"}</Meta>
          <Meta label="Expires">
            {link ? (link.expiresAt ? fmtDate(link.expiresAt) : "Never") : "—"}
          </Meta>
          <Meta label="Status">
            {link ? (
              <Badge variant={link.active ? "success" : "secondary"}>
                {link.active ? "Active" : "Inactive"}
              </Badge>
            ) : (
              "—"
            )}
          </Meta>
        </dl>

        {link && <CopyButton text={link.shortUrl} className="self-start" />}
      </Card>
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
      className="rounded-sm text-2xl break-all transition-colors outline-none hover:text-highlight focus-visible:ring-2 focus-visible:ring-highlight"
    >
      <span className="text-muted-foreground">{link.shortUrl.slice(0, -link.slug.length)}</span>
      {link.slug}
    </a>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <Typography as="dt" className={eyebrow}>
        {label}
      </Typography>
      <Typography as="dd" className="text-sm tabular-nums">
        {children}
      </Typography>
    </div>
  );
}
