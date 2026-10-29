"use client";

import { CopyButton } from "@/components/copy-button";
import { fieldLabel } from "@/components/form/text-field";
import { Badge } from "@/components/ui/badge";
import type { LinkResponse } from "@/features/shorten/api";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

// The bottom of the form sheet: the short link pasted on as tape, then the link's details.
export function LinkTag({ link }: { link: LinkResponse | null }) {
  return (
    <article aria-live="polite" className="flex flex-col">
      <div className="flex flex-col gap-3 border-t border-dashed border-input px-5 pt-4 pb-5">
        <span className={fieldLabel}>Short link</span>
        <div className="flex min-h-16 flex-wrap items-center justify-between gap-4">
          {link ? (
            <>
              <ShortLink link={link} />
              <CopyButton
                text={link.shortUrl}
                variant="default"
                size="default"
                className="bg-tape text-tape-foreground hover:bg-tape/80 max-sm:w-full"
              />
            </>
          ) : (
            <span className="rounded-[3px] border border-dashed border-input px-4 py-2.5 font-mono text-2xl text-muted-foreground">
              your-link
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 border-t border-border sm:grid-cols-4">
        <dl className="contents">
          <Meta label="Chars">
            {link ? `${link.targetUrl.length} → ${link.shortUrl.length}` : "—"}
          </Meta>
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
      </div>
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
      className="animate-tape-print inline-block rotate-[-0.6deg] rounded-[3px] bg-tape px-4 py-2.5 font-mono text-xl font-bold text-tape-foreground shadow-[0_1px_1px_rgb(0_0_0/8%)] outline-none hover:underline hover:decoration-1 hover:underline-offset-4 focus-visible:ring-2 focus-visible:ring-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-card @md:text-2xl"
    >
      {/* The protocol is noise on a strip; the label and href keep the full URL. */}
      <span className="break-all opacity-60">
        {link.shortUrl.slice(0, -link.slug.length).replace(/^https?:\/\//, "")}
      </span>
      <span className="whitespace-nowrap">{link.slug}</span>
    </a>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5 border-border px-5 py-3 odd:border-r max-sm:nth-[-n+2]:border-b sm:border-r sm:last-of-type:border-r-0">
      <dt className={fieldLabel}>{label}</dt>
      <dd className="font-mono text-sm whitespace-nowrap tabular-nums">{children}</dd>
    </div>
  );
}
