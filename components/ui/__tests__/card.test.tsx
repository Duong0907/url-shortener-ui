import { render, screen } from "@testing-library/react";

import { Card } from "@/components/ui/card";

describe("Card", () => {
  it("is a border-only surface", () => {
    render(<Card data-testid="c">x</Card>);
    expect(screen.getByTestId("c")).toHaveClass("rounded-lg", "border-foreground/10", "p-5");
  });

  it("sets size and merges className", () => {
    render(
      <Card size="sm" className="extra" data-testid="c">
        x
      </Card>,
    );
    const card = screen.getByTestId("c");
    expect(card).toHaveAttribute("data-size", "sm");
    expect(card).toHaveClass("extra");
  });

  it("defaults size to default", () => {
    render(<Card data-testid="c">x</Card>);
    expect(screen.getByTestId("c")).toHaveAttribute("data-size", "default");
  });
});
