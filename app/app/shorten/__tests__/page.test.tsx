import { render, screen } from "@testing-library/react";

import ShortenPage, { metadata } from "@/app/app/shorten/page";

describe("shorten page", () => {
  it("renders the form", () => {
    render(<ShortenPage />);
    expect(screen.getByLabelText("URL to shorten")).toBeInTheDocument();
    expect(metadata.title).toBe("Shorten · URL Shortener");
  });
});
