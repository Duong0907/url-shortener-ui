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
  it("gets the page with the token", async () => {
    const body = { content: [], page: { size: 10, number: 2, totalElements: 0, totalPages: 0 } };
    fetchMock.mockResolvedValue(reply(200, body));
    await expect(listLinks(2)).resolves.toEqual(body);
    expect(fetchMock).toHaveBeenCalledWith("/api/links?page=2&size=10", {
      headers: { Authorization: "Bearer tok" },
    });
  });

  it("maps failures to the generic message", async () => {
    fetchMock.mockResolvedValue(reply(500));
    await expect(listLinks(0)).rejects.toThrow("Something went wrong. Try again");
  });

  it("maps a network error to the unreachable message", async () => {
    fetchMock.mockRejectedValue(new TypeError("fail"));
    await expect(listLinks(0)).rejects.toThrow("Can't reach server");
  });
});
