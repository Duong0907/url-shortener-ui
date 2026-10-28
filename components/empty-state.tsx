import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

// A short message with one link that tells the user what to do next.
export function EmptyState({ text, href, action }: { text: string; href: string; action: string }) {
  return (
    <div className="flex flex-col items-start gap-3">
      <p className="text-muted-foreground">{text}</p>
      <Link href={href} className={buttonVariants({ variant: "outline", size: "sm" })}>
        {action}
      </Link>
    </div>
  );
}
