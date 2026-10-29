"use client";

import Link from "next/link";
import { useFormContext, useWatch } from "react-hook-form";

import { SwitchField } from "@/components/form/switch-field";
import { fieldLabel, TextField } from "@/components/form/text-field";
import { Typography } from "@/components/ui/typography";
import { useAuth } from "@/features/auth/store";

export function SlugPanel() {
  const status = useAuth((s) => s.status);
  const { formState, clearErrors } = useFormContext();
  const authed = status === "authed";
  const custom = useWatch({ name: "custom" }) === true;
  const enabled = authed && custom;

  if (status === "anon") {
    return (
      <div className="flex flex-col gap-1.5 border-t border-dashed border-input pt-4">
        <span className={fieldLabel}>Custom link · optional</span>
        <Typography className="text-sm text-muted-foreground">
          <Link
            href="/login"
            className="rounded-sm text-highlight underline underline-offset-4 outline-none hover:decoration-2 focus-visible:ring-2 focus-visible:ring-highlight"
          >
            Log in
          </Link>
          &nbsp;to choose your own link.
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 border-t border-dashed border-input pt-4">
      <div className="flex items-center gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className={fieldLabel}>Custom link · optional</span>
          <Typography className="text-sm text-muted-foreground">
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
          <TextField
            name="slug"
            aria-label="Custom link"
            placeholder="my-link"
            autoFocus
            className="font-mono"
          />
          {!formState.errors.slug && (
            <Typography className="text-xs text-muted-foreground">
              3-32 letters, numbers, - or _
            </Typography>
          )}
        </div>
      )}
    </div>
  );
}
