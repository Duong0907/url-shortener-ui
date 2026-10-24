import { StrictMode } from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { VerifyEmail } from "@/features/auth/components/verify-email";
import { useAuth } from "@/features/auth/store";

const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ replace: mockReplace }) }));

// jsdom has no Response, so fetch returns plain objects.
const reply = (status: number, body: unknown = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

// The component caches one request per token for the page's lifetime, so each test uses a new token.
let n = 0;
const newToken = () => `tok-${++n}`;

const fetchMock = jest.fn();
beforeEach(() => {
  fetchMock.mockReset();
  mockReplace.mockReset();
  global.fetch = fetchMock as unknown as typeof fetch;
  useAuth.setState({ status: "anon", token: null, email: null });
});

describe("VerifyEmail", () => {
  it("verifies the token and links to log in", async () => {
    const token = newToken();
    fetchMock.mockResolvedValueOnce(reply(204));
    render(<VerifyEmail token={token} />);
    expect(screen.getByRole("status")).toHaveTextContent("Verifying your email…");
    expect(await screen.findByText("Email verified")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute("href", "/login");
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/verify-email",
      expect.objectContaining({ body: JSON.stringify({ token }) }),
    );
  });

  it("shows the invalid state with a resend form on 400", async () => {
    fetchMock.mockResolvedValueOnce(reply(400)).mockResolvedValueOnce(reply(204));
    const user = userEvent.setup();
    render(<VerifyEmail token={newToken()} />);
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "This link is invalid or has expired.",
    );
    expect(screen.getByRole("button", { name: "Resend email" })).toBeDisabled();
    await user.type(screen.getByLabelText("Email"), "a@b.co");
    // The button remounts when the email changes, so query it again.
    await user.click(screen.getByRole("button", { name: "Resend email" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Sent. Check your inbox.");
  });

  it("treats a missing token as invalid without calling the server", () => {
    render(<VerifyEmail token={null} />);
    expect(screen.getByRole("alert")).toHaveTextContent("This link is invalid or has expired.");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("lets the user retry after a network error", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("fail")).mockResolvedValueOnce(reply(204));
    render(<VerifyEmail token={newToken()} />);
    expect(await screen.findByRole("alert")).toHaveTextContent("Can't reach server");
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByText("Email verified")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("posts once under Strict Mode", async () => {
    fetchMock.mockResolvedValue(reply(204));
    render(
      <StrictMode>
        <VerifyEmail token={newToken()} />
      </StrictMode>,
    );
    expect(await screen.findByText("Email verified")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("waits for the session check before posting", async () => {
    useAuth.setState({ status: "loading", token: null, email: null });
    fetchMock.mockResolvedValueOnce(reply(204));
    render(<VerifyEmail token={newToken()} />);
    expect(screen.getByRole("status")).toHaveTextContent("Verifying your email…");
    expect(fetchMock).not.toHaveBeenCalled();
    act(() => useAuth.setState({ status: "anon", token: null, email: null }));
    expect(await screen.findByText("Email verified")).toBeInTheDocument();
  });

  it("sends signed-in users home without using the token", () => {
    useAuth.setState({ status: "authed", token: "tok", email: "a@b.co" });
    render(<VerifyEmail token={newToken()} />);
    expect(mockReplace).toHaveBeenCalledWith("/");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
