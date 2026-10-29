import { zodResolver } from "@hookform/resolvers/zod";
import { render } from "@testing-library/react";
import { useForm, type FieldValues } from "react-hook-form";
import type { z } from "zod";

import { Form } from "@/components/form/form";

type Options<T extends FieldValues> = {
  defaultValues: T;
  schema?: z.ZodType<T, T>;
  onSubmit?: (values: T) => void | Promise<void>;
};

function Harness<T extends FieldValues>({
  ui,
  defaultValues,
  schema,
  onSubmit = () => {},
}: Options<T> & { ui: React.ReactNode }) {
  const form = useForm<T>({
    defaultValues: defaultValues as never,
    resolver: schema ? zodResolver(schema) : undefined,
  });

  return (
    <Form form={form} onSubmit={onSubmit}>
      {ui}
    </Form>
  );
}

// Renders fields inside a real <Form>, so they get the form from context like in the app.
export function renderInForm<T extends FieldValues>(ui: React.ReactNode, options: Options<T>) {
  return render(<Harness ui={ui} {...options} />);
}
