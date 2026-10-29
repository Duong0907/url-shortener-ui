"use client";

import Link from "next/link";
import { cn } from "cn";
import { Link2 } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import { SwitchField } from "@/components/form/switch-field";
import { TextField } from "@/components/form/text-field";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { useAuth } from "@/features/auth/store";

export function SlugPanel() {
  const status = useAuth((s) => s.status);
  const { formState, clearErrors } = useFormContext();
  const authed = status === "authed";
  const custom = useWatch({ name: "custom" }) === true;
  const enabled = authed && custom;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border bg-muted p-4 transition-colors",
        enabled && "border-highlight/50",
      )}
    >
      <div className="flex items-center gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-highlight/10 text-highlight">
          <Link2 className="size-4" aria-hidden />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <Typography weight="medium" className="flex items-center gap-2 text-sm">
            Custom link <Badge variant="outline">Optional</Badge>
          </Typography>
          <Typography className="text-xs text-muted-foreground">
            {authed ? "Pick your own ending instead of a random one" : "Available when logged in"}
          </Typography>
        </div>
        <SwitchField
          name="custom"
          aria-label="Use a custom link"
          disabled={!authed}
          onChange={(on) => {
            if (!on) clearErrors("slug");
          }}
        />
      </div>

      {enabled && (
        <div className="flex flex-col gap-1.5">
          <TextField name="slug" aria-label="Custom link" placeholder="my-link" autoFocus />
          {!formState.errors.slug && (
            <Typography className="text-xs text-muted-foreground">
              3-32 letters, numbers, - or _
            </Typography>
          )}
        </div>
      )}

      {status === "anon" && (
        <Typography className="text-sm text-muted-foreground">
          <Link href="/login" className="text-highlight underline-offset-4 hover:underline">
            Log in
          </Link>
          &nbsp;to choose your own link.
        </Typography>
      )}
    </div>
  );
}
