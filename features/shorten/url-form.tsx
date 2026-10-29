"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { Form } from "@/components/form/form";
import { FormError } from "@/components/form/form-error";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { Button } from "@/components/ui/button";
import { urlSchema } from "@/features/shorten/schema";

type Props = {
  error: string | null;
  onSubmit: (url: string) => Promise<void>;
};

type Values = { url: string };

export function UrlForm({ error, onSubmit }: Props) {
  const [pasteError, setPasteError] = useState<string | null>(null);
  const form = useForm<Values>({ defaultValues: { url: "" }, resolver: zodResolver(urlSchema) });
  const {
    control,
    setValue,
    setFocus,
    formState: { isSubmitting },
  } = form;
  const blank = !useWatch({ control, name: "url" }).trim();

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
      <Form
        form={form}
        onSubmit={({ url }) => onSubmit(url)}
        className="flex-row items-start gap-3"
      >
        <div className="flex-1">
          <TextField
            name="url"
            aria-label="URL to shorten"
            autoFocus
            placeholder="https://example.com/very/long/link"
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
        <SubmitButton busy="Shortening..." disabled={blank}>
          Shorten
        </SubmitButton>
      </Form>
      <FormError error={error ?? pasteError} />
    </div>
  );
}
