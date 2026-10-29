"use client";

import { LoaderIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";

type Props = Omit<React.ComponentProps<typeof Button>, "type" | "children"> & {
  children: React.ReactNode;
  // Label while busy, e.g. "Logging in…".
  busy: React.ReactNode;
  // Stays busy after the submit ends (e.g. while a redirect runs).
  pending?: boolean;
};

// Must render inside <Form>. Busy while the form submits.
export function SubmitButton({ children, busy, pending = false, disabled, ...props }: Props) {
  const { formState } = useFormContext();
  const isBusy = formState.isSubmitting || pending;

  return (
    <Button type="submit" disabled={isBusy || disabled} {...props}>
      {isBusy && (
        <LoaderIcon aria-hidden className="size-4 animate-spin motion-reduce:animate-none" />
      )}
      {isBusy ? busy : children}
    </Button>
  );
}
