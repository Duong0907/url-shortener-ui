import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { listLinks } from "@/features/links/api";
import { MyLinks } from "@/features/links/my-links";
import { renderWithQuery } from "@/test-utils/render-with-query";

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
const listOf = (items: unknown[], nextCursor: string | null = null) => ({ items, nextCursor });

beforeEach(() => listMock.mockReset());

describe("MyLinks", () => {
  it("shows loading, then the rows", async () => {
    listMock.mockResolvedValue(listOf([link("abc"), link("off", false)]));
    renderWithQuery(<MyLinks />);
    expect(screen.getByText("Loading…")).toBeInTheDocument();
    expect(await screen.findByText("abc")).toBeInTheDocument();
    expect(screen.getByTitle("https://example.com/abc")).toHaveTextContent("example.com/abc");
    expect(screen.getAllByText("Inactive")).toHaveLength(1);
    expect(screen.getAllByRole("heading", { name: "Oct 10, 2026" })).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: "Copy" })).toHaveLength(2);
    expect(screen.queryByRole("button", { name: "Load more" })).not.toBeInTheDocument();
    expect(listMock).toHaveBeenCalledWith(undefined);
  });

  it("loads more links after the cursor", async () => {
    const user = userEvent.setup();
    listMock
      .mockResolvedValueOnce(listOf([link("abc")], "c1"))
      .mockResolvedValueOnce(listOf([link("def")]));
    renderWithQuery(<MyLinks />);
    await user.click(await screen.findByRole("button", { name: "Load more" }));
    expect(await screen.findByText("def")).toBeInTheDocument();
    expect(screen.getByText("abc")).toBeInTheDocument();
    expect(listMock).toHaveBeenLastCalledWith("c1");
    expect(screen.queryByRole("button", { name: "Load more" })).not.toBeInTheDocument();
    expect(screen.getByText("That’s every link.")).toBeInTheDocument();
  });

  it("keeps the rows when loading more fails", async () => {
    const user = userEvent.setup();
    listMock
      .mockResolvedValueOnce(listOf([link("abc")], "c1"))
      .mockRejectedValueOnce(new Error("Can't reach server"));
    renderWithQuery(<MyLinks />);
    await user.click(await screen.findByRole("button", { name: "Load more" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Can't reach server");
    expect(screen.getByText("abc")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Load more" })).toBeEnabled();
  });

  it("shows the empty state", async () => {
    listMock.mockResolvedValue(listOf([]));
    renderWithQuery(<MyLinks />);
    expect(await screen.findByText("No links yet.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Shorten one" })).toHaveAttribute(
      "href",
      "/app/shorten",
    );
  });

  it("shows the error and retries", async () => {
    const user = userEvent.setup();
    listMock
      .mockRejectedValueOnce(new Error("Can't reach server"))
      .mockResolvedValueOnce(listOf([link("abc")]));
    renderWithQuery(<MyLinks />);
    expect(await screen.findByRole("alert")).toHaveTextContent("Can't reach server");
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByText("abc")).toBeInTheDocument();
  });
});
