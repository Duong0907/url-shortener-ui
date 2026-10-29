"use client";

import { useController, useFormContext } from "react-hook-form";

import { Switch } from "@/components/ui/switch";

export type SwitchFieldProps = Omit<
  React.ComponentProps<typeof Switch>,
  "name" | "checked" | "defaultChecked" | "onCheckedChange"
> & {
  name: string;
  onChange?: (checked: boolean) => void;
};

// Must render inside <Form>. Its checked state is the boolean form value `name`, and it goes
// read-only while the form submits.
export function SwitchField({ name, onChange, ...switchProps }: SwitchFieldProps) {
  const { formState } = useFormContext();
  const { field } = useController({ name });

  return (
    <Switch
      {...switchProps}
      checked={field.value === true}
      onCheckedChange={(checked) => {
        field.onChange(checked);
        onChange?.(checked);
      }}
      onBlur={field.onBlur}
      readOnly={formState.isSubmitting}
    />
  );
}
