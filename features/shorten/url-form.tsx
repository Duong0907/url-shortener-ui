"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { Form } from "@/components/form/form";
import { FormError } from "@/components/form/form-error";
import { SubmitButton } from "@/components/form/submit-button";
import { fieldLabel, TextField } from "@/components/form/text-field";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/store";
import { urlSchema } from "@/features/shorten/schema";
import { SlugPanel } from "@/features/shorten/slug-panel";

type Props = {
  error: string | null;
  onSubmit: (values: { url: string; slug?: string }) => Promise<void>;
};

type Values = { url: string; custom?: boolean; slug?: string };

export function UrlForm({ error, onSubmit }: Props) {
  const [pasteError, setPasteError] = useState<string | null>(null);
  const authed = useAuth((s) => s.status === "authed");
  const form = useForm<Values>({
    defaultValues: { url: "", custom: false, slug: "" },
    resolver: zodResolver(urlSchema),
  });

  const {
    control,
    setValue,
    setFocus,
    formState: { isSubmitting },
  } = form;

  const isUrlBlank = !useWatch({ control, name: "url" }).trim();

  const handleSubmit = ({ url, custom, slug }: Values) =>
    onSubmit(custom && authed ? { url, slug } : { url });

  async function paste() {
    try {
      const text = (await navigator.clipboard.readText()).trim();

      setPasteError(null);

      if (!text) return;

      setValue("url", text);
      setFocus("url");
    } catch {
      setPasteError("Can't read the clipboard. Paste it into the field instead");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {/* The label sits outside TextField so the form row holds only the input and the button.
          A label inside the field would push the button off the input's line: up to the label
          with items-start, or down to the error message with items-end. */}
      <label htmlFor="url" className={fieldLabel}>
        URL to shorten
      </label>
      <Form form={form} onSubmit={handleSubmit} className="flex-row flex-wrap items-start gap-3">
        <div className="min-w-0 flex-[1_1_16rem]">
          <TextField
            name="url"
            autoFocus
            className="font-mono"
            placeholder="Paste a long URL"
            onChange={() => setPasteError(null)}
            end={
              <Button
                type="button"
                variant="ghost"
                size="xs"
                className="absolute inset-y-0 right-2 my-auto"
                disabled={isSubmitting}
                onClick={paste}
              >
                Paste
              </Button>
            }
          />
        </div>
        <SubmitButton
          busy="Shortening..."
          disabled={isUrlBlank}
          className="max-sm:w-full disabled:border-foreground/25 disabled:bg-transparent disabled:text-muted-foreground disabled:opacity-100"
        >
          Shorten
        </SubmitButton>
        <div className="w-full">
          <SlugPanel />
        </div>
      </Form>
      <FormError error={error ?? pasteError} />
    </div>
  );
}
