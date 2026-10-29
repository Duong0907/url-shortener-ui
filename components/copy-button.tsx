"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type ButtonProps = React.ComponentProps<typeof Button>;

// icon swaps the text for a copy glyph; the label stays as the accessible name.
export function CopyButton({
  text,
  variant = "outline",
  size = "sm",
  icon = false,
  className,
}: { text: string; icon?: boolean } & Pick<ButtonProps, "variant" | "size" | "className">) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);

    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  }

  const label = copied ? "Copied" : "Copy";

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={copy}
      aria-label={icon ? label : undefined}
      title={icon ? label : undefined}
    >
      {icon ? copied ? <CheckIcon aria-hidden /> : <CopyIcon aria-hidden /> : label}
    </Button>
  );
}
