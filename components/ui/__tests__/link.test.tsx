import { render, screen } from "@testing-library/react";

import { Link } from "@/components/ui/link";

describe("Link", () => {
  it("renders anchor with href and shared link styles", () => {
    render(<Link href="/login">Log in</Link>);
    const link = screen.getByRole("link", { name: "Log in" });
    expect(link).toHaveAttribute("href", "/login");
    expect(link).toHaveAttribute("data-slot", "link");
    expect(link).toHaveClass("text-primary", "underline-offset-4", "hover:underline");
  });

  it("merges custom className with shared styles", () => {
    render(
      <Link href="/register" className="extra">
        Sign up
      </Link>,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveClass("text-primary", "extra");
  });
});
