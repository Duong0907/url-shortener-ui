"use client";

import { cn } from "cn";
import {
  FormProvider,
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form";

type Props<T extends FieldValues> = {
  // The object returned by useForm. Fields and SubmitButton inside read it from context.
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  className?: string;
  children: React.ReactNode;
};

// Provides the form to its fields and renders the <form>. Browser validation is off: the
// resolver (Zod) reports errors under each field instead.
export function Form<T extends FieldValues>({ form, onSubmit, className, children }: Props<T>) {
  return (
    <FormProvider {...form}>
      <form
        noValidate
        className={cn("flex flex-col gap-4", className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {children}
      </form>
    </FormProvider>
  );
}
