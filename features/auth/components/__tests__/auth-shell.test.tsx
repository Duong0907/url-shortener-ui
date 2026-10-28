import { render, screen } from "@testing-library/react";

import { AuthShell } from "@/features/auth/components/auth-shell";

describe("AuthShell", () => {
  it("renders the title as h1, the aside and the children", () => {
    render(
      <AuthShell title="Log in" aside={<p>Lead</p>}>
        <button>Go</button>
      </AuthShell>,
    );
    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toHaveTextContent("Log in");
    expect(title).toHaveClass("text-2xl", "font-normal");
    expect(screen.getByText("Lead")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go" })).toBeInTheDocument();
  });
});
