"use client";

import { useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { cn } from "cn";

import { CopyButton } from "@/components/copy-button";
import { EmptyState } from "@/components/empty-state";
import { Pager } from "@/components/pager";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { listLinks } from "@/features/links/api";
import type { LinkResponse } from "@/features/shorten/api";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-highlight";

// URL pages count from 1. Anything else falls back to page 1.
function pageFrom(raw: string | null) {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 ? n : 1;
}

export function MyLinks() {
  const page = pageFrom(useSearchParams().get("page"));
  const query = useQuery({
    queryKey: ["links", page],
    queryFn: () => listLinks(page - 1),
    placeholderData: keepPreviousData,
  });

  return (
    <div className="flex flex-col">
      <SectionHeader title="My links" description="Every link you shortened, newest first." />
      {query.isPending ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : query.isError ? (
        <div className="flex flex-col items-start gap-3">
          <p role="alert" className="text-sm text-destructive">
            {query.error.message}
          </p>
          <Button variant="outline" size="sm" onClick={() => query.refetch()}>
            Try again
          </Button>
        </div>
      ) : query.data.page.totalElements === 0 ? (
        <EmptyState text="No links yet." href="/app/shorten" action="Shorten one" />
      ) : query.data.content.length === 0 ? (
        <EmptyState text="No links on this page." href="/app/links" action="Go to page 1" />
      ) : (
        <>
          <ul
            className={cn(
              "divide-y divide-border border-y border-border transition-opacity motion-reduce:transition-none",
              query.isPlaceholderData && "opacity-60",
            )}
          >
            {query.data.content.map((link) => (
              <LinkRow key={link.id} link={link} />
            ))}
          </ul>
          {query.data.page.totalPages > 1 && (
            <Pager
              page={page}
              totalPages={query.data.page.totalPages}
              hrefFor={(to) => `/app/links?page=${to}`}
              busy={query.isPlaceholderData}
            />
          )}
        </>
      )}
    </div>
  );
}

function LinkRow({ link }: { link: LinkResponse }) {
  return (
    <li className="flex items-center gap-3 py-3.5">
      <span
        aria-hidden
        className={cn(
          "size-2 shrink-0 rounded-full",
          link.active ? "bg-green-500" : "bg-muted-foreground/40",
        )}
      />
      <span className="sr-only">{link.active ? "Active" : "Inactive"}</span>
      <div className="min-w-0 flex-1">
        <a
          href={link.shortUrl}
          target="_blank"
          rel="noreferrer"
          className={cn("rounded-sm break-all transition-colors hover:text-highlight", focusRing)}
        >
          <span className="text-muted-foreground">{link.shortUrl.slice(0, -link.slug.length)}</span>
          {link.slug}
        </a>
        <span title={link.targetUrl} className="block truncate text-sm text-muted-foreground">
          {link.targetUrl}
        </span>
      </div>
      <time
        dateTime={link.createdAt}
        className="hidden text-sm whitespace-nowrap text-muted-foreground tabular-nums sm:block"
      >
        {fmtDate(link.createdAt)}
      </time>
      <CopyButton text={link.shortUrl} variant="ghost" size="xs" />
    </li>
  );
}
