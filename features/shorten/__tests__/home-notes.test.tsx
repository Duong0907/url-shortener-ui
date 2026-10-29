import { render, screen } from "@testing-library/react";

import { HomeNotes } from "@/features/shorten/home-notes";

describe("HomeNotes", () => {
  it("lists the three steps in order", () => {
    render(<HomeNotes />);
    const steps = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(steps).toEqual(["Paste", "Shorten", "Share"]);
  });

  it("links to registration", () => {
    render(<HomeNotes />);
    expect(screen.getByRole("link", { name: "Create an account" })).toHaveAttribute(
      "href",
      "/register",
    );
  });
});
