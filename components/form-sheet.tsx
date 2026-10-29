import { cn } from "cn";

import { fieldLabel } from "@/components/form/text-field";

// The telegraph-form sheet: a labelled header row over the caller's content. Callers pad their
// own sections, so full-width rows (like the link details) can reach the sheet edges.
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
        "min-w-0 overflow-hidden rounded-lg border border-input bg-card shadow-[0_1px_2px_rgb(0_0_0/5%),0_18px_40px_-20px_rgb(0_0_0/22%)]",
        className,
      )}
    >
      <div className="flex min-h-11 items-center justify-between border-b border-border px-5 py-2">
        <span className={fieldLabel}>{label}</span>
        {meta && (
          <span className="font-mono text-sm text-muted-foreground tabular-nums">{meta}</span>
        )}
      </div>
      {children}
    </section>
  );
}
