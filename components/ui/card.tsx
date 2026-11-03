import * as React from "react";
import { cn } from "cn";

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-5 text-sm shadow-[0_1px_2px_rgb(16_24_40/5%)] transition-colors hover:border-input",
        className,
      )}
      {...props}
    />
  );
}

export { Card };
