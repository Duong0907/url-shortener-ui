import { render, screen } from "@testing-library/react";

import { Pager } from "@/components/pager";

const hrefFor = (page: number) => `/items?page=${page}`;

describe("Pager", () => {
  it("links to the pages around the current one", () => {
    render(<Pager page={2} totalPages={3} hrefFor={hrefFor} />);
    expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "‹ Prev" })).toHaveAttribute("href", "/items?page=1");
    expect(screen.getByRole("link", { name: "Next ›" })).toHaveAttribute("href", "/items?page=3");
  });

  it.each([
    [1, "‹ Prev"],
    [3, "Next ›"],
  ])("disables the step past the end on page %i", (page, name) => {
    render(<Pager page={page} totalPages={3} hrefFor={hrefFor} />);
    expect(screen.getByRole("button", { name })).toBeDisabled();
  });

  it("disables Next while busy", () => {
    render(<Pager page={1} totalPages={3} hrefFor={hrefFor} busy />);
    expect(screen.getByRole("button", { name: "Next ›" })).toBeDisabled();
  });
});
