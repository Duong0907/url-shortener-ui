import { authedFetch } from "@/features/auth/authed-fetch";
import { refreshSession, useAuth } from "@/features/auth/store";

jest.mock("@/features/auth/store", () => ({
  ...jest.requireActual("@/features/auth/store"),
  refreshSession: jest.fn(),
}));

const refreshMock = refreshSession as jest.Mock;
// jsdom has no Response, so fetch returns plain objects.
const reply = (status: number) => ({ ok: status < 300, status, json: async () => ({}) });
const fetchMock = jest.fn();

beforeEach(() => {
  fetchMock.mockReset();
  refreshMock.mockReset();
  global.fetch = fetchMock as unknown as typeof fetch;
  useAuth.setState({ status: "anon", token: null, email: null });
});

const signIn = (token: string) => useAuth.setState({ status: "authed", token, email: "a@b.co" });

describe("authedFetch", () => {
  it("sends the request unchanged without a token", async () => {
    fetchMock.mockResolvedValue(reply(200));
    const init = { method: "POST", headers: { "Content-Type": "application/json" } };
    await authedFetch("/api/x", init);
    expect(fetchMock).toHaveBeenCalledWith("/api/x", init);
  });

  it("adds the bearer token and keeps other headers", async () => {
    signIn("tok");
    fetchMock.mockResolvedValue(reply(200));
    await authedFetch("/api/x", { headers: { "Content-Type": "application/json" } });
    expect(fetchMock).toHaveBeenCalledWith("/api/x", {
      headers: { "Content-Type": "application/json", Authorization: "Bearer tok" },
    });
  });

  it("refreshes once on 401 and retries with the new token", async () => {
    signIn("old");
    fetchMock.mockResolvedValueOnce(reply(401)).mockResolvedValueOnce(reply(200));
    refreshMock.mockResolvedValue("new");
    const res = await authedFetch("/api/x");
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenLastCalledWith("/api/x", {
      headers: { Authorization: "Bearer new" },
    });
  });

  it("returns the 401 when the refresh fails", async () => {
    signIn("old");
    fetchMock.mockResolvedValue(reply(401));
    refreshMock.mockResolvedValue(null);
    expect((await authedFetch("/api/x")).status).toBe(401);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does not refresh a 401 sent without a token", async () => {
    fetchMock.mockResolvedValue(reply(401));
    await authedFetch("/api/x");
    expect(refreshMock).not.toHaveBeenCalled();
  });
});
