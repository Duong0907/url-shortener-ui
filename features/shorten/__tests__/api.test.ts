import { createLink } from "@/features/shorten/api";

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

describe("createLink", () => {
  it("posts the URL and returns the link", async () => {
    fetchMock.mockResolvedValue(reply(201, link));

    await expect(createLink("https://example.com")).resolves.toEqual(link);
    expect(fetchMock).toHaveBeenCalledWith("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUrl: "https://example.com" }),
    });
  });

  it("maps 400 to the invalid URL message", async () => {
    fetchMock.mockResolvedValue(reply(400));
    await expect(createLink("nope")).rejects.toThrow("That URL isn't valid");
  });

  it("maps other failures to the generic message", async () => {
    fetchMock.mockResolvedValue(reply(500));
    await expect(createLink("https://example.com")).rejects.toThrow(
      "Something went wrong. Try again",
    );
  });

  it("maps a network error to the unreachable message", async () => {
    fetchMock.mockRejectedValue(new TypeError("fail"));
    await expect(createLink("https://example.com")).rejects.toThrow("Can't reach server");
  });
});
