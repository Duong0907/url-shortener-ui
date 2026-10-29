"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { cn } from "cn";
import { Link2, List, LogOut, Settings } from "lucide-react";

import { fieldLabel } from "@/components/form/text-field";
import { ThemeSwitch } from "@/components/theme-switch";
import { Button } from "@/components/ui/button";
import { logout, useAuth } from "@/features/auth/store";
import { listLinks } from "@/features/links/api";

const ITEMS = [
  { href: "/app/shorten", label: "Shorten", Icon: Link2 },
  { href: "/app/links", label: "My links", Icon: List },
  { href: "/app/settings", label: "Settings", Icon: Settings },
];

const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-highlight";

export const wordmark = "font-display text-base font-bold tracking-[0.28em]";

// Shared by the desktop sidebar and the phone drawer: an index of the form's sections.
// The /app guard redirects after log out. Only the desktop sidebar collapses to icons.
export function SidebarNav({
  onNavigate,
  collapsed = false,
}: {
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  const pathname = usePathname();
  const active = ITEMS.findIndex(({ href }) => pathname.startsWith(href));
  const email = useAuth((s) => s.email);
  const authed = useAuth((s) => s.status === "authed");
  // Same key as the first page of My links, so the count shares its cache and refetches
  // when a new link invalidates ["links"].
  const total = useQuery({ queryKey: ["links", 0], queryFn: () => listLinks(0), enabled: authed })
    .data?.page.totalElements;

  return (
    <div className="flex h-full flex-col">
      {/* Same height and rule as the public nav bar and the phone header. Collapsed, the
          wordmark shrinks to its first letter. */}
      <div className="flex min-h-14.25 items-center border-b border-border px-6">
        <Link
          href="/app/shorten"
          onClick={onNavigate}
          aria-label={collapsed ? "Shortener" : undefined}
          className={cn("rounded-sm whitespace-nowrap", focusRing)}
        >
          <span className={wordmark}>{collapsed ? "S" : "SHORTENER"}</span>
        </Link>
      </div>

      <nav aria-label="Main" className="relative flex flex-col gap-1 px-3 py-3">
        {/* One soft wash marks the current page and slides between the items, so changing
            page moves it instead of swapping two highlights. Items are h-9 with gap-1, so
            each step is 2.5rem. */}
        {active >= 0 && (
          <span
            aria-hidden
            className="absolute inset-x-3 top-3 h-9 rounded-md bg-muted transition-transform duration-300 ease-out motion-reduce:transition-none"
            style={{ transform: `translateY(${active * 2.5}rem)` }}
          />
        )}
        {/* Collapsing only narrows the sidebar: icons keep their place and the clipped label
            still names the link. */}
        {ITEMS.map(({ href, label, Icon }, i) => (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            aria-current={i === active ? "page" : undefined}
            className={cn(
              "relative flex h-9 items-center gap-3 rounded-md px-3 text-[0.95rem] font-medium whitespace-nowrap transition-colors duration-300 motion-reduce:transition-none",
              focusRing,
              i === active
                ? "font-semibold text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
            <span
              className={cn(
                "flex flex-1 items-center justify-between gap-3 transition-opacity duration-200 motion-reduce:transition-none",
                collapsed && "opacity-0",
              )}
            >
              {label}
              {href === "/app/links" && total !== undefined && (
                <span className="font-mono text-xs font-normal text-muted-foreground tabular-nums">
                  {total}
                </span>
              )}
            </span>
          </Link>
        ))}
      </nav>

      {collapsed ? (
        <div className="mt-auto flex flex-col items-center gap-3 border-t border-dashed border-input py-5">
          <ThemeSwitch />
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Log out"
            title={email ? `Log out ${email}` : "Log out"}
            onClick={logout}
          >
            <LogOut />
          </Button>
        </div>
      ) : (
        <div className="mt-auto flex flex-col gap-3 border-t border-dashed border-input p-5">
          <div className="flex min-w-0 flex-col gap-1.5">
            <span className={fieldLabel}>Signed in as</span>
            <span title={email ?? undefined} className="truncate font-mono text-sm">
              {email}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="hidden md:block">
              <ThemeSwitch />
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              Log out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
