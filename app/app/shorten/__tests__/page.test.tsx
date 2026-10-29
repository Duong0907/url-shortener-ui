import { screen } from "@testing-library/react";

import ShortenPage, { metadata } from "@/app/app/shorten/page";
import { renderWithQuery } from "@/test-utils/render-with-query";

describe("shorten page", () => {
  it("renders the form", () => {
    renderWithQuery(<ShortenPage />);
    expect(screen.getByLabelText("URL to shorten")).toBeInTheDocument();
    expect(metadata.title).toBe("Shorten · URL Shortener");
  });
});
