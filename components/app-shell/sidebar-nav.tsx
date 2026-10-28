"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";

import { ThemeSwitch } from "@/components/theme-switch";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { logout, useAuth } from "@/features/auth/store";

const ITEMS = [
  { href: "/app/shorten", label: "Shorten" },
  { href: "/app/links", label: "My links" },
  { href: "/app/settings", label: "Settings" },
];

const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-highlight";

// Shared by the desktop sidebar and the phone drawer. The /app guard redirects after log out.
export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const email = useAuth((s) => s.email);

  return (
    // md:py-10 matches the main column, so the logo lines up with the page heading.
    <div className="flex h-full flex-col gap-6 p-4 md:py-10">
      <Link
        href="/app/shorten"
        onClick={onNavigate}
        className={cn("self-start rounded-sm px-3", focusRing)}
      >
        <Typography as="span" variant="h4" weight="bold">
          SHORTENER
        </Typography>
      </Link>

      <nav aria-label="Main" className="flex flex-col gap-1">
        {ITEMS.map(({ href, label }) => {
          const active = pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-lg px-3 py-2.5 transition-colors motion-reduce:transition-none",
                focusRing,
                active
                  ? "bg-highlight/10 text-highlight"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex flex-col gap-3 border-t border-border px-3 pt-4">
        <span title={email ?? undefined} className="truncate text-sm text-muted-foreground">
          {email}
        </span>
        <div className="flex items-center justify-between gap-3">
          <div className="hidden md:block">
            <ThemeSwitch />
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
}
