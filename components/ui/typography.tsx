import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "text-4xl",
      h2: "text-3xl",
      h3: "text-2xl",
      h4: "text-xl",
      h5: "text-lg",
      h6: "text-base",
      body: "",
    },
    weight: {
      light: "font-light",
      regular: "font-normal",
      medium: "font-medium",
      bold: "font-bold",
      black: "font-black",
    },
  },
  defaultVariants: { variant: "body", weight: "regular" },
});

const defaultTag = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  body: "p",
} as const;

type TypographyProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof typographyVariants> & {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "label" | "dt" | "dd";
    // Only used with as="label".
    htmlFor?: string;
  };

function Typography({ variant, weight, as, className, ...props }: TypographyProps) {
  const Tag = as ?? defaultTag[variant ?? "body"];
  return (
    <Tag
      data-slot="typography"
      className={cn(typographyVariants({ variant, weight }), className)}
      {...props}
    />
  );
}

export { Typography };
