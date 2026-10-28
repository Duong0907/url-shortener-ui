import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { listLinks } from "@/features/links/api";
import { MyLinks } from "@/features/links/my-links";
import { renderWithQuery } from "@/test-utils/render-with-query";

let mockParams = new URLSearchParams();
jest.mock("next/navigation", () => ({ useSearchParams: () => mockParams }));
jest.mock("@/features/links/api", () => ({ listLinks: jest.fn() }));

const listMock = listLinks as jest.Mock;
const link = (slug: string, active = true) => ({
  id: slug,
  slug,
  shortUrl: `http://localhost:8080/${slug}`,
  targetUrl: `https://example.com/${slug}`,
  active,
  createdAt: "2026-10-10T12:00:00Z",
});
const pageOf = (content: unknown[], number: number, totalPages: number, totalElements = 25) => ({
  content,
  page: { size: 20, number, totalElements, totalPages },
});

beforeEach(() => {
  listMock.mockReset();
  mockParams = new URLSearchParams();
});

describe("MyLinks", () => {
  it("shows loading, then the rows", async () => {
    listMock.mockResolvedValue(pageOf([link("abc"), link("off", false)], 0, 1, 2));
    renderWithQuery(<MyLinks />);
    expect(screen.getByText("Loading…")).toBeInTheDocument();
    expect(await screen.findByText("abc")).toBeInTheDocument();
    expect(screen.getByText("https://example.com/abc")).toHaveAttribute(
      "title",
      "https://example.com/abc",
    );
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();
    expect(screen.getAllByText("Oct 10, 2026")).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: "Copy" })).toHaveLength(2);
    expect(screen.queryByText(/Page 1 of/)).not.toBeInTheDocument();
    expect(listMock).toHaveBeenCalledWith(0);
  });

  it.each([
    ["3", 2],
    ["abc", 0],
    ["0", 0],
  ])("reads ?page=%s as API page %i", async (raw, apiPage) => {
    mockParams = new URLSearchParams({ page: raw });
    listMock.mockResolvedValue(pageOf([link("abc")], apiPage, 5));
    renderWithQuery(<MyLinks />);
    await screen.findByText("abc");
    expect(listMock).toHaveBeenCalledWith(apiPage);
  });

  it("shows the empty state", async () => {
    listMock.mockResolvedValue(pageOf([], 0, 0, 0));
    renderWithQuery(<MyLinks />);
    expect(await screen.findByText("No links yet.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Shorten one" })).toHaveAttribute(
      "href",
      "/app/shorten",
    );
  });

  it("shows a page past the end", async () => {
    mockParams = new URLSearchParams({ page: "9" });
    listMock.mockResolvedValue(pageOf([], 8, 2));
    renderWithQuery(<MyLinks />);
    expect(await screen.findByText("No links on this page.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go to page 1" })).toHaveAttribute(
      "href",
      "/app/links",
    );
  });

  it("shows the error and retries", async () => {
    const user = userEvent.setup();
    listMock
      .mockRejectedValueOnce(new Error("Can't reach server"))
      .mockResolvedValueOnce(pageOf([link("abc")], 0, 1, 1));
    renderWithQuery(<MyLinks />);
    expect(await screen.findByRole("alert")).toHaveTextContent("Can't reach server");
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByText("abc")).toBeInTheDocument();
  });

  it("links to the pages around the current one", async () => {
    mockParams = new URLSearchParams({ page: "2" });
    listMock.mockResolvedValue(pageOf([link("abc")], 1, 3));
    renderWithQuery(<MyLinks />);
    expect(await screen.findByText("Page 2 of 3")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "‹ Prev" })).toHaveAttribute(
      "href",
      "/app/links?page=1",
    );
    expect(screen.getByRole("link", { name: "Next ›" })).toHaveAttribute(
      "href",
      "/app/links?page=3",
    );
  });

  it.each([
    ["1", "‹ Prev"],
    ["3", "Next ›"],
  ])("disables the step past the end on page %s", async (raw, name) => {
    mockParams = new URLSearchParams({ page: raw });
    listMock.mockResolvedValue(pageOf([link("abc")], Number(raw) - 1, 3));
    renderWithQuery(<MyLinks />);
    await screen.findByText("abc");
    expect(screen.getByRole("button", { name })).toBeDisabled();
  });
});
