import { render, screen } from "@testing-library/react";

import { Button, buttonVariants } from "@/components/ui/button";

describe("Button", () => {
  it("renders with default variant and size", () => {
    render(<Button>Go</Button>);
    const btn = screen.getByRole("button", { name: "Go" });
    expect(btn).toHaveAttribute("data-slot", "button");
    expect(btn).toHaveClass("bg-foreground", "h-11", "uppercase");
  });

  it("applies variant, size and custom class", () => {
    render(
      <Button variant="destructive" size="lg" className="extra">
        Del
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveClass("text-destructive", "h-12", "extra");
  });

  it("is disabled when disabled prop is set", () => {
    render(<Button disabled>No</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("link variant drops the control height and padding", () => {
    const cls = buttonVariants({ variant: "link" });
    expect(cls).toContain("underline-offset-4");
    expect(cls).toContain("h-auto");
    expect(cls).not.toContain("h-11");
    expect(cls).not.toContain("px-6");
  });
});
