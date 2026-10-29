import { render, screen } from "@testing-library/react";

import { SectionHeader } from "@/components/ui/section-header";

describe("SectionHeader", () => {
  it("renders an h1 title and a quiet subtitle", () => {
    render(<SectionHeader title="Title" description="Sub" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Title");
    const sub = screen.getByText("Sub");
    expect(sub.tagName).toBe("P");
    expect(sub).toHaveClass("text-muted-foreground");
  });
});
