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
        "group/card flex h-full flex-col gap-3 rounded-lg border border-foreground/10 p-5 text-sm transition-colors hover:border-foreground/25",
        className,
      )}
      {...props}
    />
  );
}

export { Card };
