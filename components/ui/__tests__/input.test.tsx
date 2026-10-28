import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Input } from "@/components/ui/input";

describe("Input", () => {
  it("renders and accepts typing", async () => {
    render(<Input aria-label="url" type="text" className="extra" />);
    const input = screen.getByLabelText("url");
    expect(input).toHaveAttribute("data-slot", "input");
    expect(input).toHaveClass("extra");
    await userEvent.type(input, "hello");
    expect(input).toHaveValue("hello");
  });

  it("is a 44px control with a highlight focus ring", () => {
    render(<Input aria-label="url" />);
    expect(screen.getByLabelText("url")).toHaveClass("h-11", "focus-visible:ring-highlight");
  });
});
