import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { FeatureReel } from "@/features/shorten/feature-reel";

describe("FeatureReel", () => {
  it("starts on the first feature", () => {
    render(<FeatureReel />);
    expect(screen.getByRole("button", { name: "Shorten demo" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "My links demo" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("jumps to a feature when its tab is clicked", async () => {
    const user = userEvent.setup();
    render(<FeatureReel />);
    await user.click(screen.getByRole("button", { name: "Custom link demo" }));
    expect(screen.getByRole("button", { name: "Custom link demo" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Shorten demo" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("holds while pointed at", async () => {
    const user = userEvent.setup();
    const { container } = render(<FeatureReel />);
    const reel = container.firstElementChild!;
    await user.hover(reel);
    expect(reel).toHaveAttribute("data-reel-paused", "true");
    await user.unhover(reel);
    expect(reel).toHaveAttribute("data-reel-paused", "false");
  });
});
