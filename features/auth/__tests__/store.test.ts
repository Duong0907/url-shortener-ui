import { login, logout, refreshSession, useAuth } from "@/features/auth/store";

// jsdom has no Response, so fetch returns plain objects.
const reply = (status: number, body: unknown = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});
const jwt = (email: string) => `h.${btoa(JSON.stringify({ email }))}.s`;

const fetchMock = jest.fn();
beforeEach(() => {
  fetchMock.mockReset();
  global.fetch = fetchMock as unknown as typeof fetch;
  useAuth.setState({ status: "loading", token: null, email: null });
});

const state = () => useAuth.getState();
const urls = () => fetchMock.mock.calls.map(([url]) => url);
const signIn = (token: string) => useAuth.setState({ status: "authed", token, email: null });

describe("refreshSession", () => {
  it("restores the session from the cookie", async () => {
    const token = jwt("a@b.co");
    fetchMock.mockResolvedValueOnce(reply(200, { accessToken: token }));
    await expect(refreshSession()).resolves.toBe(token);
    expect(state()).toEqual({ status: "authed", token, email: "a@b.co" });
  });

  it("is anonymous when refresh returns 401", async () => {
    fetchMock.mockResolvedValueOnce(reply(401));
    await expect(refreshSession()).resolves.toBeNull();
    expect(state()).toEqual({ status: "anon", token: null, email: null });
  });

  it("is anonymous when the server is unreachable", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("fail"));
    await expect(refreshSession()).resolves.toBeNull();
    expect(state().status).toBe("anon");
  });

  it("shares one request between parallel calls", async () => {
    fetchMock.mockResolvedValue(reply(401));
    await Promise.all([refreshSession(), refreshSession()]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("login", () => {
  it("stores the token and email", async () => {
    fetchMock.mockResolvedValueOnce(reply(200, { accessToken: jwt("a@b.co") }));
    await login("a@b.co", "pw");
    expect(state()).toMatchObject({ status: "authed", email: "a@b.co" });
  });

  it("throws the API message and keeps state", async () => {
    fetchMock.mockResolvedValueOnce(reply(401));
    await expect(login("a@b.co", "pw")).rejects.toThrow("Wrong email or password");
    expect(state().status).toBe("loading");
  });
});

describe("logout", () => {
  it("clears the session", async () => {
    signIn("tok");
    fetchMock.mockResolvedValueOnce(reply(204));
    await logout();
    expect(urls()).toEqual(["/api/auth/logout"]);
    expect(state()).toEqual({ status: "anon", token: null, email: null });
  });

  it("clears the session even when the server is unreachable", async () => {
    signIn("tok");
    fetchMock.mockRejectedValueOnce(new TypeError("fail"));
    await expect(logout()).resolves.toBeUndefined();
    expect(state().status).toBe("anon");
  });
});
