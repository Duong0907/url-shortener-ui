"use client";

import { CopyButton } from "@/components/copy-button";
import { fieldLabel } from "@/components/form/text-field";
import { Badge } from "@/components/ui/badge";
import type { LinkResponse } from "@/features/shorten/api";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

// The bottom of the form card: the short link on the blue result tint, then the link's details.
// Before a result there is only the slot the result will reveal into; the details wait for a link.
export function LinkTag({ link }: { link: LinkResponse | null }) {
  return (
    <article aria-live="polite" className="flex flex-col">
      <div className="flex flex-col gap-3 border-t border-border px-6 pt-5 pb-6">
        <span className={fieldLabel}>Short link</span>
        <div className="flex min-h-16 flex-wrap items-center justify-between gap-4">
          {link ? (
            <>
              <ShortLink link={link} />
              {/* With a link printed, Copy is the next step, so it takes the filled style. */}
              <CopyButton
                text={link.shortUrl}
                variant="default"
                size="default"
                className="max-sm:w-full"
              />
            </>
          ) : (
            <span className="flex min-h-13 w-full items-center rounded-sm border border-dashed border-input px-4 text-sm text-muted-foreground">
              Your short link appears here
            </span>
          )}
        </div>
      </div>

      {link && (
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
      )}
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
      className="animate-tape-print inline-block max-w-full wrap-anywhere rounded-lg bg-tape px-4 p y-2.5 text-xl font-semibold text-tape-foreground outline-none hover:underline hover:decoration-1 hover:underline-offset-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card @md:text-2xl"
    >
      {/* The protocol is noise on a strip; the label and href keep the full URL. */}
      <span className="break-all opacity-60">
        {link.shortUrl.slice(0, -link.slug.length).replace(/^https?:\/\//, "")}
      </span>
      <span>{link.slug}</span>
    </a>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5 border-border px-6 py-3 odd:border-r max-sm:nth-[-n+2]:border-b sm:border-r sm:last-of-type:border-r-0">
      <dt className={fieldLabel}>{label}</dt>
      <dd className="text-sm whitespace-nowrap tabular-nums">{children}</dd>
    </div>
  );
}
