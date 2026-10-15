import { emailFromToken, login, logout, refresh, register } from "@/features/auth/api";

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

const post = (body?: unknown) => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: body === undefined ? undefined : JSON.stringify(body),
});

describe("register", () => {
  it("posts the credentials", async () => {
    fetchMock.mockResolvedValue(reply(201, { id: "1", email: "a@b.co" }));
    await expect(register("a@b.co", "password123")).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/register",
      post({ email: "a@b.co", password: "password123" }),
    );
  });

  it("maps 409 to the taken message", async () => {
    fetchMock.mockResolvedValue(reply(409));
    await expect(register("a@b.co", "password123")).rejects.toThrow(
      "That email is already registered",
    );
  });

  it("maps 400 to the invalid message", async () => {
    fetchMock.mockResolvedValue(reply(400));
    await expect(register("a", "x")).rejects.toThrow("Check your email and password");
  });

  it("maps other failures to the generic message", async () => {
    fetchMock.mockResolvedValue(reply(500));
    await expect(register("a@b.co", "password123")).rejects.toThrow(
      "Something went wrong. Try again",
    );
  });
});

describe("login", () => {
  it("posts the credentials and returns the access token", async () => {
    fetchMock.mockResolvedValue(reply(200, { accessToken: "tok", tokenType: "Bearer" }));
    await expect(login("a@b.co", "pw")).resolves.toBe("tok");
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/login",
      post({ email: "a@b.co", password: "pw" }),
    );
  });

  it("maps 401 to the wrong credentials message", async () => {
    fetchMock.mockResolvedValue(reply(401));
    await expect(login("a@b.co", "pw")).rejects.toThrow("Wrong email or password");
  });

  it("maps other failures to the generic message", async () => {
    fetchMock.mockResolvedValue(reply(500));
    await expect(login("a@b.co", "pw")).rejects.toThrow("Something went wrong. Try again");
  });

  it("maps a network error to the unreachable message", async () => {
    fetchMock.mockRejectedValue(new TypeError("fail"));
    await expect(login("a@b.co", "pw")).rejects.toThrow("Can't reach server");
  });
});

describe("refresh", () => {
  it("returns the new access token", async () => {
    fetchMock.mockResolvedValue(reply(200, { accessToken: "new" }));
    await expect(refresh()).resolves.toBe("new");
    expect(fetchMock).toHaveBeenCalledWith("/api/auth/refresh", post());
  });

  it("returns null when there is no session", async () => {
    fetchMock.mockResolvedValue(reply(401));
    await expect(refresh()).resolves.toBeNull();
  });
});

describe("logout", () => {
  it("posts to the logout endpoint", async () => {
    fetchMock.mockResolvedValue(reply(204));
    await logout();
    expect(fetchMock).toHaveBeenCalledWith("/api/auth/logout", post());
  });
});

describe("emailFromToken", () => {
  it("reads the email claim", () => {
    const token = `h.${btoa(JSON.stringify({ sub: "1", email: "a@b.co" }))}.s`;
    expect(emailFromToken(token)).toBe("a@b.co");
  });

  it("reads base64url payloads", () => {
    // With this payload, base64 has a "/", which base64url writes as "_". Plain atob rejects "_".
    const payload = btoa(JSON.stringify({ email: "a@b.co", x: "??>" }))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    expect(payload).toContain("_");
    expect(emailFromToken(`h.${payload}.s`)).toBe("a@b.co");
  });

  it("returns null for a malformed token", () => {
    expect(emailFromToken("garbage")).toBeNull();
  });
});
