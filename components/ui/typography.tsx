import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "font-heading text-4xl leading-none font-bold tracking-tight text-balance sm:text-6xl",
      h2: "font-heading text-3xl leading-tight font-bold tracking-tight text-balance",
      h3: "font-heading text-2xl leading-snug font-semibold text-balance",
      h4: "font-heading text-xl leading-snug font-semibold",
      p: "text-base leading-relaxed",
      small: "text-sm",
      overline: "text-[11px] tracking-widest text-muted-foreground uppercase",
      code: "font-mono text-2xl break-all sm:text-3xl",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    },
  },
  defaultVariants: { variant: "p" },
});

const defaultTag = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  p: "p",
  small: "small",
  overline: "p",
  code: "code",
} as const;

type TypographyProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof typographyVariants> & {
    as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "small" | "code" | "dt" | "dd";
  };

function Typography({ variant, weight, as, className, ...props }: TypographyProps) {
  const Tag = as ?? defaultTag[variant ?? "p"];
  return (
    <Tag
      data-slot="typography"
      className={cn(typographyVariants({ variant, weight }), className)}
      {...props}
    />
  );
}

export { Typography, typographyVariants };
