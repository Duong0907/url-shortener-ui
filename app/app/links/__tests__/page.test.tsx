import { screen } from "@testing-library/react";

import LinksPage, { metadata } from "@/app/app/links/page";
import { listLinks } from "@/features/links/api";
import { renderWithQuery } from "@/test-utils/render-with-query";

jest.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams() }));
jest.mock("@/features/links/api", () => ({ listLinks: jest.fn() }));

describe("links page", () => {
  it("renders My links", async () => {
    (listLinks as jest.Mock).mockResolvedValue({
      content: [],
      page: { size: 10, number: 0, totalElements: 0, totalPages: 0 },
    });
    renderWithQuery(<LinksPage />);
    expect(await screen.findByText("No links yet.")).toBeInTheDocument();
    expect(metadata.title).toBe("My links · URL Shortener");
  });
});
