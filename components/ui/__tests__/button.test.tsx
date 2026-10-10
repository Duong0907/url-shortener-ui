import { render, screen } from "@testing-library/react";

import { Button, buttonVariants } from "@/components/ui/button";

describe("Button", () => {
  it("renders with default variant and size", () => {
    render(<Button>Go</Button>);
    const btn = screen.getByRole("button", { name: "Go" });
    expect(btn).toHaveAttribute("data-slot", "button");
    expect(btn).toHaveClass("bg-primary", "h-8");
  });

  it("applies variant, size and custom class", () => {
    render(
      <Button variant="destructive" size="lg" className="extra">
        Del
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveClass("text-destructive", "h-9", "extra");
  });

  it("is disabled when disabled prop is set", () => {
    render(<Button disabled>No</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("buttonVariants returns class string", () => {
    expect(buttonVariants({ variant: "link" })).toContain("underline-offset-4");
  });
});
