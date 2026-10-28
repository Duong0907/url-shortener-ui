import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AuthForm } from "@/features/auth/components/auth-form";
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
  useAuth.setState({ status: "anon", token: null, email: null });
});

async function fill(mode: "login" | "register", password: string, confirm = password) {
  const user = userEvent.setup();
  render(<AuthForm mode={mode} />);
  await user.type(screen.getByLabelText("Email"), "a@b.co");
  await user.type(screen.getByLabelText("Password"), password);
  if (mode === "register") await user.type(screen.getByLabelText("Confirm password"), confirm);
  return user;
}

describe("AuthForm login", () => {
  it("logs in and goes home", async () => {
    fetchMock.mockResolvedValueOnce(reply(200, { accessToken: jwt("a@b.co") }));
    const user = await fill("login", "pw");
    await user.click(screen.getByRole("button", { name: "Log in" }));
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/app/shorten"));
    expect(fetchMock.mock.calls[0]).toEqual([
      "/api/auth/login",
      expect.objectContaining({ body: JSON.stringify({ email: "a@b.co", password: "pw" }) }),
    ]);
  });

  it("shows the error on wrong credentials and enables the button again", async () => {
    fetchMock.mockResolvedValueOnce(reply(401));
    const user = await fill("login", "pw");
    await user.click(screen.getByRole("button", { name: "Log in" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Wrong email or password");
    expect(screen.getByRole("button", { name: "Log in" })).toBeEnabled();
    expect(screen.queryByRole("button", { name: "Resend email" })).not.toBeInTheDocument();
  });

  it("offers a resend when the email is not verified", async () => {
    fetchMock.mockResolvedValueOnce(reply(403)).mockResolvedValueOnce(reply(204));
    const user = await fill("login", "pw");
    await user.click(screen.getByRole("button", { name: "Log in" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Verify your email first. Check your inbox.",
    );
    await user.click(screen.getByRole("button", { name: "Resend email" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Sent. Check your inbox.");
    expect(fetchMock.mock.calls[1]).toEqual([
      "/api/auth/resend-verification",
      expect.objectContaining({ body: JSON.stringify({ email: "a@b.co" }) }),
    ]);
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("has no confirm field and links to sign up", () => {
    render(<AuthForm mode="login" />);
    expect(screen.queryByLabelText("Confirm password")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign up" })).toHaveAttribute("href", "/register");
  });

  it("goes home when already signed in", () => {
    useAuth.setState({ status: "authed", token: "tok", email: "a@b.co" });
    render(<AuthForm mode="login" />);
    expect(mockReplace).toHaveBeenCalledWith("/app/shorten");
  });
});

describe("AuthForm register", () => {
  it("registers and shows the check-email state", async () => {
    fetchMock.mockResolvedValueOnce(reply(201, { id: "1", email: "a@b.co", emailVerified: false }));
    const user = await fill("register", "password123");
    await user.click(screen.getByRole("button", { name: "Sign up" }));
    expect(await screen.findByRole("heading", { name: "Check your email" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("We sent a link to a@b.co.");
    expect(screen.getByRole("button", { name: "Resend email" })).toBeEnabled();
    expect(fetchMock.mock.calls[0]).toEqual([
      "/api/auth/register",
      expect.objectContaining({
        body: JSON.stringify({
          email: "a@b.co",
          password: "password123",
          confirmPassword: "password123",
        }),
      }),
    ]);
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("rejects a short password without calling the server", async () => {
    const user = await fill("register", "short");
    await user.click(screen.getByRole("button", { name: "Sign up" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Password needs at least 8 characters",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects mismatched passwords without calling the server", async () => {
    const user = await fill("register", "password123", "password124");
    await user.click(screen.getByRole("button", { name: "Sign up" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Passwords don't match");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows the taken-email error with a log in link and no resend", async () => {
    fetchMock.mockResolvedValueOnce(reply(409));
    const user = await fill("register", "password123");
    await user.click(screen.getByRole("button", { name: "Sign up" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("That email is already registered.");
    expect(screen.getByRole("link", { name: "Log in instead" })).toHaveAttribute("href", "/login");
    expect(screen.queryByRole("button", { name: "Resend email" })).not.toBeInTheDocument();
  });

  it("toggles both password fields", async () => {
    const user = await fill("register", "password123");
    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "text");
    expect(screen.getByLabelText("Confirm password")).toHaveAttribute("type", "text");
    await user.click(screen.getByRole("button", { name: "Hide password" }));
    expect(screen.getByLabelText("Confirm password")).toHaveAttribute("type", "password");
  });

  it("caps both password fields at 72 characters", () => {
    render(<AuthForm mode="register" />);
    for (const label of ["Password", "Confirm password"]) {
      expect(screen.getByLabelText(label)).toHaveAttribute("maxLength", "72");
      expect(screen.getByLabelText(label)).toHaveAttribute("autoComplete", "new-password");
    }
  });
});
