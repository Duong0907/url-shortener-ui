import { screen } from "@testing-library/react";

import LinksPage, { metadata } from "@/app/app/links/page";
import { listLinks } from "@/features/links/api";
import { renderWithQuery } from "@/test-utils/render-with-query";

jest.mock("@/features/links/api", () => ({ listLinks: jest.fn() }));

describe("links page", () => {
  it("renders My links", async () => {
    (listLinks as jest.Mock).mockResolvedValue({ items: [], nextCursor: null });
    renderWithQuery(<LinksPage />);
    expect(await screen.findByText("No links yet.")).toBeInTheDocument();
    expect(metadata.title).toBe("My links · URL Shortener");
  });
});
