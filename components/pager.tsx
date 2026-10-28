import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";

// Prev/Next links for 1-based pages. busy disables Next while the next page loads.
export function Pager({
  page,
  totalPages,
  hrefFor,
  busy = false,
}: {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
  busy?: boolean;
}) {
  const step = (to: number, label: React.ReactNode, enabled: boolean) =>
    enabled ? (
      <Link href={hrefFor(to)} className={buttonVariants({ variant: "ghost", size: "sm" })}>
        {label}
      </Link>
    ) : (
      <Button variant="ghost" size="sm" disabled>
        {label}
      </Button>
    );

  return (
    <nav aria-label="Pages" className="flex items-center justify-center gap-4 pt-5">
      {step(page - 1, <>&lsaquo; Prev</>, page > 1)}
      <span className="text-sm text-muted-foreground tabular-nums">
        Page {page} of {totalPages}
      </span>
      {step(page + 1, <>Next &rsaquo;</>, page < totalPages && !busy)}
    </nav>
  );
}
