import { cn } from "cn";

import { fieldLabel } from "@/components/form/text-field";

// A dashboard card with a labelled header row over the caller's content. Callers pad their
// own sections, so full-width rows (like the link details) can reach the card edges.
export function FormSheet({
  label,
  meta,
  className,
  children,
}: {
  label: string;
  meta?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-label={label}
      className={cn(
        "min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_2px_rgb(16_24_40/5%)]",
        className,
      )}
    >
      <div className="flex min-h-12 items-center justify-between border-b border-border px-6 py-2">
        <span className={fieldLabel}>{label}</span>
        {meta && <span className="text-sm text-muted-foreground tabular-nums">{meta}</span>}
      </div>
      {children}
    </section>
  );
}
