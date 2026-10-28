import { render, screen } from "@testing-library/react";

import { Typography } from "@/components/ui/typography";

describe("Typography", () => {
  it.each([
    ["h1", "H1", "text-4xl"],
    ["h2", "H2", "text-3xl"],
    ["h3", "H3", "text-2xl"],
    ["h4", "H4", "text-xl"],
    ["h5", "H5", "text-lg"],
    ["h6", "H6", "text-base"],
  ] as const)("renders variant %s as <%s> with %s", (variant, tag, size) => {
    render(<Typography variant={variant}>text</Typography>);
    const el = screen.getByText("text");
    expect(el.tagName).toBe(tag);
    expect(el).toHaveClass(size);
  });

  it("defaults to body text with regular weight", () => {
    render(<Typography>text</Typography>);
    const el = screen.getByText("text");
    expect(el.tagName).toBe("P");
    expect(el).toHaveAttribute("data-slot", "typography");
    expect(el).toHaveClass("font-normal");
  });

  it("uses the as prop to override the element", () => {
    render(
      <dl>
        <Typography as="dd">text</Typography>
      </dl>,
    );
    expect(screen.getByText("text").tagName).toBe("DD");
  });

  it("applies the weight prop", () => {
    render(
      <Typography variant="h4" weight="light">
        text
      </Typography>,
    );
    expect(screen.getByText("text")).toHaveClass("font-light", "text-xl");
  });

  it("merges className and passes HTML attributes", () => {
    render(
      <Typography role="alert" className="text-destructive">
        text
      </Typography>,
    );
    expect(screen.getByRole("alert")).toHaveClass("text-destructive", "font-normal");
  });
});
