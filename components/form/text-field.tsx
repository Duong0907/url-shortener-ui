"use client";

import { cn } from "cn";
import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";

export type TextFieldProps = Omit<
  React.ComponentProps<typeof Input>,
  "name" | "onChange" | "readOnly" | "value" | "defaultValue"
> & {
  name: string;
  label?: string;
  end?: React.ReactNode;
  onChange?: () => void;
};

// Must render inside <Form>. Registers itself with the form, shows its own error, and goes
// read-only while the form submits.
export function TextField({ name, label, end, className, id, onChange, ...input }: TextFieldProps) {
  const { register, getFieldState, formState } = useFormContext();
  const { error } = getFieldState(name, formState);
  const inputId = id ?? name;
  const errorId = `${inputId}-error`;

  const control = (
    <Input
      {...input}
      {...register(name, { onChange })}
      id={inputId}
      className={cn(end && "pr-20", className)}
      readOnly={formState.isSubmitting}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errorId : undefined}
    />
  );

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <Typography as="label" htmlFor={inputId} weight="medium" className="text-sm leading-none">
          {label}
        </Typography>
      )}
      {end ? (
        <div className="relative">
          {control}
          {end}
        </div>
      ) : (
        control
      )}
      {error?.message && (
        <p id={errorId} className="text-xs text-destructive">
          {error.message}
        </p>
      )}
    </div>
  );
}
