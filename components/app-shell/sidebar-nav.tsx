"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import { Link2, List, LogOut, Settings } from "lucide-react";

import { fieldLabel } from "@/components/form/text-field";
import { ThemeSwitch } from "@/components/theme-switch";
import { Button } from "@/components/ui/button";
import { logout, useAuth } from "@/features/auth/store";

const ITEMS = [
  { href: "/app/shorten", label: "Shorten", Icon: Link2 },
  { href: "/app/links", label: "My links", Icon: List },
  { href: "/app/settings", label: "Settings", Icon: Settings },
];

const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-highlight";

// Secondary text on the deeper sidebar: muted-foreground is too light there for 4.5:1.
const sidebarMuted = "text-sidebar-foreground/75";

export const wordmark = "text-base font-bold tracking-[0.14em]";

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

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Same height and rule as the public nav bar and the phone header. Collapsed, the
          wordmark shrinks to its first letter. */}
      <div className="flex min-h-14.25 items-center border-b border-sidebar-border px-6">
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
        {/* The current page is a lit sheet pulled out of the deeper sidebar. It slides between
            the items, so changing page moves it instead of swapping two highlights. Items are
            h-9 with gap-1, so each step is 2.5rem. */}
        {active >= 0 && (
          <span
            aria-hidden
            className="absolute inset-x-3 top-3 h-9 rounded-md bg-card shadow-[0_1px_2px_rgb(0_0_0/8%),0_4px_10px_-6px_rgb(0_0_0/18%)] transition-transform duration-300 ease-out motion-reduce:transition-none"
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
              "relative flex h-9 items-center gap-3 rounded-md px-3 text-base font-medium whitespace-nowrap transition-colors duration-300 motion-reduce:transition-none",
              focusRing,
              i === active
                ? "font-semibold text-sidebar-foreground"
                : cn(sidebarMuted, "hover:text-sidebar-foreground"),
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
            </span>
          </Link>
        ))}
      </nav>

      {collapsed ? (
        <div className="mt-auto flex flex-col items-center gap-3 border-t border-sidebar-border py-5">
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
        <div className="mt-auto flex flex-col gap-3 border-t border-sidebar-border p-5">
          <div className="flex min-w-0 flex-col gap-1.5">
            <span className={cn(fieldLabel, sidebarMuted)}>Signed in as</span>
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
