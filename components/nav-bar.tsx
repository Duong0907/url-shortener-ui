import Link from "next/link";

import { ThemeSwitch } from "@/components/theme-switch";
import { UserMenu } from "@/features/auth/components/user-menu";

export function NavBar() {
  return (
    <nav className="flex w-full flex-col items-center border-b border-border">
      <div className="flex min-h-14.25 w-full max-w-250 flex-row items-center justify-between gap-3">
        <Link
          href="/"
          className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-highlight"
        >
          <span className="font-display text-base font-bold tracking-[0.28em]">SHORTENER</span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeSwitch />
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}
