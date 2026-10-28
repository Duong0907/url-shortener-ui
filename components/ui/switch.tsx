"use client";

import { type ReactElement } from "react";
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "cn";

function Switch({
  className,
  size = "default",
  iconOn,
  iconOff,
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default" | "xl";
  iconOn?: ReactElement;
  iconOff?: ReactElement;
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-all motion-reduce:transition-none outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-2 focus-visible:ring-highlight aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-checked:bg-highlight data-disabled:cursor-not-allowed data-disabled:opacity-50 data-unchecked:bg-input data-[size=default]:h-[18.4px] data-[size=default]:w-8 data-[size=sm]:h-3.5 data-[size=sm]:w-6 data-[size=xl]:h-[27.6px] data-[size=xl]:w-12 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:data-unchecked:bg-input/80",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="group pointer-events-none flex rounded-full bg-background ring-0 transition-transform motion-reduce:transition-none group-data-[size=default]/switch:size-4 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:size-3 group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-unchecked:translate-x-0 group-data-[size=xl]/switch:size-6 group-data-[size=xl]/switch:data-checked:translate-x-[calc(100%-3px)] group-data-[size=xl]/switch:data-unchecked:translate-x-px dark:data-checked:bg-primary-foreground dark:data-unchecked:bg-foreground"
      >
        {iconOn && (
          <span className="hidden w-full items-center justify-center text-primary select-none group-data-checked:flex">
            {iconOn}
          </span>
        )}
        {iconOff && (
          <span className="hidden w-full items-center justify-center text-muted-foreground select-none group-data-unchecked:flex">
            {iconOff}
          </span>
        )}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

export { Switch };
