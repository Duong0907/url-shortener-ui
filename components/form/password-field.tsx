"use client";

import { TextField, type TextFieldProps } from "@/components/form/text-field";
import { Button } from "@/components/ui/button";

type Props = Omit<TextFieldProps, "type" | "end"> & {
  shown: boolean;
  onShownChange?: (shown: boolean) => void;
  // false hides the Show/Hide button (a confirm field shares the password field's toggle).
  toggle?: boolean;
};

export function PasswordField({ shown, onShownChange, toggle = true, ...props }: Props) {
  return (
    <TextField
      {...props}
      type={shown ? "text" : "password"}
      end={
        toggle && (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className="absolute inset-y-0 right-2 my-auto"
            aria-label={shown ? "Hide password" : "Show password"}
            onClick={() => onShownChange?.(!shown)}
          >
            {shown ? "Hide" : "Show"}
          </Button>
        )
      }
    />
  );
}
