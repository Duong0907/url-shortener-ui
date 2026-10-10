import { render, screen } from "@testing-library/react";

import { Typography, typographyVariants } from "@/components/ui/typography";

describe("Typography", () => {
  it.each([
    ["h1", "H1"],
    ["p", "P"],
    ["overline", "P"],
    ["code", "CODE"],
  ] as const)("renders variant %s as <%s>", (variant, tag) => {
    render(<Typography variant={variant}>text</Typography>);
    expect(screen.getByText("text").tagName).toBe(tag);
  });

  it("defaults to the p variant", () => {
    render(<Typography>text</Typography>);
    const el = screen.getByText("text");
    expect(el.tagName).toBe("P");
    expect(el).toHaveAttribute("data-slot", "typography");
  });

  it("uses the as prop to override the element", () => {
    render(
      <dl>
        <Typography as="dd" variant="small">
          text
        </Typography>
      </dl>,
    );
    expect(screen.getByText("text").tagName).toBe("DD");
  });

  it("replaces the variant weight with the weight prop", () => {
    render(
      <Typography variant="h1" weight="medium">
        text
      </Typography>,
    );
    const el = screen.getByText("text");
    expect(el).toHaveClass("font-medium");
    expect(el).not.toHaveClass("font-bold");
  });

  it("merges className", () => {
    render(<Typography className="text-destructive">text</Typography>);
    expect(screen.getByText("text")).toHaveClass("text-destructive", "text-base");
  });

  it("typographyVariants returns the class string", () => {
    expect(typographyVariants({ variant: "overline" })).toContain("uppercase");
  });
});
