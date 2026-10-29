import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ShortenForm } from "@/features/shorten/shorten-form";
import { renderWithQuery } from "@/test-utils/render-with-query";

const link = {
  id: "1",
  slug: "abc123",
  shortUrl: "http://localhost:8080/abc123",
  targetUrl: "https://example.com",
  active: true,
  createdAt: "2026-10-10T00:00:00Z",
};

// jsdom has no Response, so fetch returns plain objects.
const reply = (status: number, body: unknown = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

const fetchMock = jest.fn();
beforeEach(() => {
  fetchMock.mockReset();
  global.fetch = fetchMock as unknown as typeof fetch;
});

async function submit(url: string) {
  const user = userEvent.setup();
  renderWithQuery(<ShortenForm />);
  await user.type(screen.getByLabelText("URL to shorten"), url);
  await user.click(screen.getByRole("button", { name: "Shorten" }));
  return user;
}

describe("ShortenForm", () => {
  it("posts the URL and shows the short link", async () => {
    fetchMock.mockResolvedValue(reply(201, link));
    await submit("https://example.com");
    expect(await screen.findByRole("link", { name: link.shortUrl })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/links",
      expect.objectContaining({ body: JSON.stringify({ targetUrl: "https://example.com" }) }),
    );
  });

  describe("My links cache", () => {
    const cached = { content: [], page: { size: 10, number: 0, totalElements: 0, totalPages: 0 } };

    async function shortenWith(status: number) {
      fetchMock.mockResolvedValue(reply(status, link));
      const user = userEvent.setup();
      const { client } = renderWithQuery(<ShortenForm />);
      client.setQueryData(["links", 1], cached);
      await user.type(screen.getByLabelText("URL to shorten"), "https://example.com");
      await user.click(screen.getByRole("button", { name: "Shorten" }));
      await screen.findByRole(status === 201 ? "link" : "alert");

      return client;
    }

    it("marks cached My links pages stale after a link is created", async () => {
      const client = await shortenWith(201);
      expect(client.getQueryState(["links", 1])?.isInvalidated).toBe(true);
    });

    it("leaves the cache alone when the request fails", async () => {
      const client = await shortenWith(400);
      expect(client.getQueryState(["links", 1])?.isInvalidated).toBe(false);
    });
  });

  it("shows an error on 400", async () => {
    fetchMock.mockResolvedValue(reply(400));
    await submit("https://nope.example");
    expect(await screen.findByRole("alert")).toHaveTextContent("That URL isn't valid");
  });

  it("clears the previous link when a later request fails", async () => {
    fetchMock.mockResolvedValueOnce(reply(201, link));
    const user = await submit("https://example.com");
    expect(await screen.findByRole("link", { name: link.shortUrl })).toBeInTheDocument();

    fetchMock.mockResolvedValueOnce(reply(400));
    await user.click(screen.getByRole("button", { name: "Shorten" }));
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: link.shortUrl })).not.toBeInTheDocument();
  });

  it("keeps the previous link visible while a new request is pending", async () => {
    fetchMock.mockResolvedValueOnce(reply(201, link));
    const user = await submit("https://example.com");
    expect(await screen.findByRole("link", { name: link.shortUrl })).toBeInTheDocument();

    fetchMock.mockReturnValueOnce(new Promise(() => {}));
    await user.click(screen.getByRole("button", { name: "Shorten" }));
    expect(screen.getByRole("link", { name: link.shortUrl })).toBeInTheDocument();
  });

  it("keeps the error visible while the request is retried", async () => {
    fetchMock.mockResolvedValueOnce(reply(400));
    const user = await submit("https://nope.example");
    expect(await screen.findByRole("alert")).toBeInTheDocument();

    fetchMock.mockReturnValueOnce(new Promise(() => {}));
    await user.click(screen.getByRole("button", { name: "Shorten" }));
    expect(screen.getByRole("alert")).toHaveTextContent("That URL isn't valid");
  });

  it("replays the new-link animation when the same URL is shortened again", async () => {
    fetchMock.mockResolvedValue(reply(201, link));
    const user = await submit("https://example.com");
    const first = (await screen.findByRole("link", { name: link.shortUrl })).closest("article");

    await user.click(screen.getByRole("button", { name: "Shorten" }));
    await screen.findByRole("button", { name: "Shorten" });
    const second = screen.getByRole("link", { name: link.shortUrl }).closest("article");
    expect(second).not.toBe(first);
    expect(second).toHaveClass("animate-in");
  });
});
