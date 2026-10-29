import { render, screen } from "@testing-library/react";

import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
  it("renders a solid pill by default", () => {
    render(<Badge>Sale</Badge>);
    const badge = screen.getByText("Sale");
    expect(badge).toHaveAttribute("data-slot", "badge");
    expect(badge).toHaveClass("rounded-full", "uppercase", "bg-foreground");
  });

  it("applies the variant and className", () => {
    render(
      <Badge variant="success" className="extra">
        Active
      </Badge>,
    );
    expect(screen.getByText("Active")).toHaveClass("text-success", "extra");
  });
});
