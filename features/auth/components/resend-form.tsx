"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";

import { Form } from "@/components/form/form";
import { FormError } from "@/components/form/form-error";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { Typography } from "@/components/ui/typography";
import { resendVerification } from "@/features/auth/api";
import { resendSchema } from "@/features/auth/schemas";

export function ResendForm() {
  const { mutateAsync, isSuccess, variables, error } = useMutation({
    mutationFn: resendVerification,
  });
  const form = useForm<{ email: string }>({
    defaultValues: { email: "" },
    resolver: zodResolver(resendSchema),
  });
  const { control } = form;
  const email = useWatch({ control, name: "email" }).trim();

  // Sent to this exact address. Editing the email re-enables the button.
  const sent = isSuccess && variables === email;

  const onValid = (value: { email: string }) => mutateAsync(value.email).catch(() => {});

  return (
    <Form form={form} onSubmit={onValid}>
      <TextField name="email" label="Email" type="email" autoComplete="email" />
      <SubmitButton variant="outline" className="w-full" busy="Sending…" disabled={!email || sent}>
        Resend email
      </SubmitButton>
      {sent && (
        <Typography role="status" className="text-sm text-muted-foreground">
          Sent. Check your inbox. Use the link in the newest email.
        </Typography>
      )}
      <FormError error={error} />
    </Form>
  );
}
