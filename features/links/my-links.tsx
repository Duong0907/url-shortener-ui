"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { cn } from "cn";

import { CopyButton } from "@/components/copy-button";
import { EmptyState } from "@/components/empty-state";
import { fieldLabel } from "@/components/form/text-field";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { listLinks } from "@/features/links/api";
import { byDay, dayLabel, fmtDate, splitTarget } from "@/features/links/services";
import type { LinkResponse } from "@/features/shorten/api";

const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-highlight";

export function MyLinks() {
  const {
    data,
    error,
    isPending,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useInfiniteQuery({
    queryKey: ["links"],
    queryFn: ({ pageParam }) => listLinks(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });
  const links = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div className="flex flex-col">
      <SectionHeader title="My links" description="Every link you shortened, newest first." />
      {isPending ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : isError && !isFetchNextPageError ? (
        <div className="flex flex-col items-start gap-3">
          <p role="alert" className="text-sm text-destructive">
            {error.message}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : links.length === 0 ? (
        <EmptyState text="No links yet." href="/app/shorten" action="Shorten one" />
      ) : (
        <div className="flex max-w-2xl flex-col gap-8">
          {byDay(links).map((group) => (
            <section key={group.day}>
              <h2 className={cn(fieldLabel, "border-b border-border pb-2")}>
                {dayLabel(group.day)}
              </h2>
              <ul className="divide-y divide-border">
                {group.links.map((link) => (
                  <LinkRow key={link.id} link={link} />
                ))}
              </ul>
            </section>
          ))}

          {hasNextPage ? (
            <div className="flex flex-col items-center gap-3">
              {isFetchNextPageError && (
                <p role="alert" className="text-sm text-destructive">
                  {error.message}
                </p>
              )}
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "Loading…" : "Load more"}
              </Button>
            </div>
          ) : (
            data.pages.length > 1 && (
              <p className="text-center text-sm text-muted-foreground">That&rsquo;s every link.</p>
            )
          )}
        </div>
      )}
    </div>
  );
}

function LinkRow({ link }: { link: LinkResponse }) {
  const [host, rest] = splitTarget(link.targetUrl);

  return (
    <li className="group flex items-center gap-3 py-3">
      <div className="min-w-0 flex-1">
        <a
          href={link.shortUrl}
          target="_blank"
          rel="noreferrer"
          title={link.shortUrl}
          className={cn(
            "rounded-sm font-mono text-lg font-bold break-all transition-colors hover:text-highlight",
            focusRing,
          )}
        >
          <span className="font-normal text-muted-foreground">/</span>
          <span>{link.slug}</span>
        </a>
        <span title={link.targetUrl} className="block truncate text-sm text-muted-foreground">
          <span className="text-foreground/85">{host}</span>
          {rest}
        </span>
      </div>
      {!link.active ? (
        <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[0.7rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          Inactive
        </span>
      ) : (
        link.expiresAt && (
          <time
            dateTime={link.expiresAt}
            className="shrink-0 font-mono text-sm whitespace-nowrap text-muted-foreground tabular-nums"
          >
            Expires {fmtDate(link.expiresAt)}
          </time>
        )
      )}
      <CopyButton
        text={link.shortUrl}
        icon
        variant="ghost"
        size="icon-sm"
        className="shrink-0 text-muted-foreground transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 hover:text-foreground motion-reduce:transition-none sm:opacity-0 [@media(hover:none)]:opacity-100"
      />
    </li>
  );
}
