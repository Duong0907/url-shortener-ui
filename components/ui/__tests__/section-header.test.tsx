import { render, screen } from "@testing-library/react";

import { SectionHeader } from "@/components/ui/section-header";

describe("SectionHeader", () => {
  it("renders a centered h1 title and a light subtitle", () => {
    render(<SectionHeader title="Title" description="Sub" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Title");
    const sub = screen.getByText("Sub");
    expect(sub.tagName).toBe("P");
    expect(sub).toHaveClass("font-light", "text-xl", "text-center");
  });
});
