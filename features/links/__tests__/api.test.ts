import { useAuth } from "@/features/auth/store";
import { listLinks } from "@/features/links/api";

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
  useAuth.setState({ status: "authed", token: "tok", email: "a@b.co" });
});

describe("listLinks", () => {
  it("gets the first links with the token", async () => {
    const body = { items: [], nextCursor: null };
    fetchMock.mockResolvedValue(reply(200, body));
    await expect(listLinks()).resolves.toEqual(body);
    expect(fetchMock).toHaveBeenCalledWith("/api/links?limit=10", {
      headers: { Authorization: "Bearer tok" },
    });
  });

  it("passes the cursor for the next links", async () => {
    fetchMock.mockResolvedValue(reply(200, { items: [], nextCursor: null }));
    await listLinks("a+b/c");
    expect(fetchMock).toHaveBeenCalledWith("/api/links?limit=10&cursor=a%2Bb%2Fc", {
      headers: { Authorization: "Bearer tok" },
    });
  });

  it("maps failures to the generic message", async () => {
    fetchMock.mockResolvedValue(reply(500));
    await expect(listLinks()).rejects.toThrow("Something went wrong. Try again");
  });

  it("maps a network error to the unreachable message", async () => {
    fetchMock.mockRejectedValue(new TypeError("fail"));
    await expect(listLinks()).rejects.toThrow("Can't reach server");
  });
});
