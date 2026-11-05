import { StrictMode } from "react";
import { render, screen, waitFor } from "@testing-library/react";

import { GoogleOneTap } from "@/features/auth/components/google-one-tap";
import { logout, useAuth } from "@/features/auth/store";

const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ replace: mockReplace }) }));

// Never load the real Google script: the stand-in reports ready as soon as it mounts.
jest.mock("next/script", () => {
  const { useEffect } = jest.requireActual("react");

  return function Script({ onReady }: { onReady: () => void }) {
    useEffect(() => onReady(), [onReady]);

    return <span data-testid="gsi" />;
  };
});

// jsdom has no Response, so fetch returns plain objects.
const reply = (status: number, body: unknown = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});
const jwt = (email: string) => `h.${btoa(JSON.stringify({ email }))}.s`;

const initialize = jest.fn();
const prompt = jest.fn();
const fetchMock = jest.fn();
let callback: (response: { credential: string }) => void;

process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = "client-id";
window.google = { accounts: { id: { initialize, prompt, disableAutoSelect: jest.fn() } } };

const anon = () => useAuth.setState({ status: "anon", token: null, email: null });

// The component initializes Google once per page, so capture the callback from one render.
beforeAll(() => {
  anon();
  render(
    <StrictMode>
      <GoogleOneTap />
    </StrictMode>,
  );
  callback = initialize.mock.calls[0][0].callback;
});

beforeEach(() => {
  fetchMock.mockReset();
  mockReplace.mockReset();
  global.fetch = fetchMock as unknown as typeof fetch;
  window.history.replaceState(null, "", "/");
  anon();
});

describe("GoogleOneTap", () => {
  it("initializes once and prompts", () => {
    expect(initialize).toHaveBeenCalledTimes(1);
    expect(initialize).toHaveBeenCalledWith(
      expect.objectContaining({
        client_id: "client-id",
        auto_select: true,
        use_fedcm_for_prompt: true,
        cancel_on_tap_outside: false,
      }),
    );
    expect(prompt).toHaveBeenCalledTimes(1);
  });

  it("renders nothing when signed in", () => {
    prompt.mockClear();
    useAuth.setState({ status: "authed", token: "tok", email: null });
    render(<GoogleOneTap />);
    expect(screen.queryByTestId("gsi")).not.toBeInTheDocument();
    expect(prompt).not.toHaveBeenCalled();
  });

  it("stores the token and goes to the app", async () => {
    fetchMock.mockResolvedValueOnce(reply(200, { accessToken: jwt("a@b.co") }));
    callback({ credential: "cred" });
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/app/shorten"));
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/google/one-tap",
      expect.objectContaining({ method: "POST", body: JSON.stringify({ credential: "cred" }) }),
    );
    expect(useAuth.getState()).toMatchObject({ status: "authed", email: "a@b.co" });
  });

  it("goes to the next page", async () => {
    window.history.replaceState(null, "", "/login?next=%2Fapp%2Flinks");
    fetchMock.mockResolvedValueOnce(reply(200, { accessToken: jwt("a@b.co") }));
    callback({ credential: "cred" });
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/app/links"));
  });

  it("shows the not-verified message on 403", async () => {
    fetchMock.mockResolvedValueOnce(reply(403));
    callback({ credential: "cred" });
    // Log in shows the same message the redirect flow shows for this error.
    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith("/login?error=email_not_verified"),
    );
  });

  it.each([401, 500])("stays put on %i", async (code) => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
    fetchMock.mockResolvedValueOnce(reply(code));
    expect(() => callback({ credential: "cred" })).not.toThrow();
    await waitFor(() => expect(warn).toHaveBeenCalled());
    expect(mockReplace).not.toHaveBeenCalled();
    expect(useAuth.getState().status).toBe("anon");
    warn.mockRestore();
  });

  // Last: logging out hides the prompt for the rest of the page load.
  it("stays hidden after log out", async () => {
    prompt.mockClear();
    useAuth.setState({ status: "authed", token: "tok", email: null });
    fetchMock.mockResolvedValueOnce(reply(204));
    await logout();
    render(<GoogleOneTap />);
    expect(screen.queryByTestId("gsi")).not.toBeInTheDocument();
    expect(prompt).not.toHaveBeenCalled();
  });
});
