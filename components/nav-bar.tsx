import Link from "next/link";

import { ThemeSwitch } from "@/components/theme-switch";
import { Typography } from "@/components/ui/typography";
import { UserMenu } from "@/features/auth/components/user-menu";

export function NavBar() {
  return (
    <nav className="flex w-full flex-col items-center border-b border-border">
      <div className="flex min-h-14.25 w-full max-w-250 flex-row items-center justify-between gap-3 px-4 sm:px-8">
        <Link
          href="/"
          className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-highlight"
        >
          <Typography as="span" variant="h4" weight="bold">
            SHORTENER
          </Typography>
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeSwitch />
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}
