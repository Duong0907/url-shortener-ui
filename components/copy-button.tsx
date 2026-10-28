"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

type ButtonProps = React.ComponentProps<typeof Button>;

export function CopyButton({
  text,
  variant = "outline",
  size = "sm",
  className,
}: { text: string } & Pick<ButtonProps, "variant" | "size" | "className">) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);

    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button type="button" variant={variant} size={size} className={className} onClick={copy}>
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}
