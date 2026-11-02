import { StrictMode } from "react";
import { render, screen, waitFor } from "@testing-library/react";

import { AuthCallback } from "@/features/auth/components/auth-callback";
import { saveNext } from "@/features/auth/next-path";
import { useAuth } from "@/features/auth/store";

const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ replace: mockReplace }) }));

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
  mockReplace.mockReset();
  global.fetch = fetchMock as unknown as typeof fetch;
  sessionStorage.clear();
  useAuth.setState({ status: "loading", token: null, email: null });
});

describe("AuthCallback", () => {
  it("goes to the saved page", async () => {
    saveNext("/app/links");
    fetchMock.mockResolvedValueOnce(reply(200, { accessToken: jwt("a@b.co") }));
    render(<AuthCallback error={null} />);
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/app/links"));
    expect(useAuth.getState().status).toBe("authed");
  });

  it("goes to the default without a saved page", async () => {
    fetchMock.mockResolvedValueOnce(reply(200, { accessToken: jwt("a@b.co") }));
    render(<AuthCallback error={null} />);
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/app/shorten"));
  });

  it("ignores an unsafe saved page", async () => {
    sessionStorage.setItem("auth:next", "//evil.com");
    fetchMock.mockResolvedValueOnce(reply(200, { accessToken: jwt("a@b.co") }));
    render(<AuthCallback error={null} />);
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/app/shorten"));
  });

  it("treats a failed refresh as oauth_failed", async () => {
    saveNext("/app/links");
    fetchMock.mockResolvedValueOnce(reply(401));
    render(<AuthCallback error={null} />);
    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith("/login?error=oauth_failed&next=%2Fapp%2Flinks"),
    );
  });

  it("returns silently on cancel", async () => {
    saveNext("/app/links");
    render(<AuthCallback error="access_denied" />);
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/login?next=%2Fapp%2Flinks"));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("passes other errors to login", async () => {
    render(<AuthCallback error="email_not_verified" />);
    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith("/login?error=email_not_verified"),
    );
  });

  it("redirects once", async () => {
    saveNext("/app/links");
    fetchMock.mockResolvedValue(reply(200, { accessToken: jwt("a@b.co") }));
    render(
      <StrictMode>
        <AuthCallback error={null} />
      </StrictMode>,
    );
    await waitFor(() => expect(mockReplace).toHaveBeenCalled());
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(mockReplace).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith("/app/links");
  });

  it("shows signing in", () => {
    fetchMock.mockReturnValue(new Promise(() => {}));
    render(<AuthCallback error={null} />);
    expect(screen.getByRole("status")).toHaveTextContent("Signing you in…");
  });
});
