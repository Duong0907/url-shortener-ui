import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AuthForm } from "@/features/auth/auth-form";
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

const urls = () => fetchMock.mock.calls.map(([url]) => url);

async function fill(mode: "login" | "register", password: string) {
  const user = userEvent.setup();
  render(<AuthForm mode={mode} />);
  await user.type(screen.getByLabelText("Email"), "a@b.co");
  await user.type(screen.getByLabelText("Password"), password);
  return user;
}

describe("AuthForm login", () => {
  it("logs in and goes home", async () => {
    fetchMock.mockResolvedValueOnce(reply(200, { accessToken: jwt("a@b.co") }));
    const user = await fill("login", "pw");
    await user.click(screen.getByRole("button", { name: "Log in" }));
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/"));
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
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("links to sign up", () => {
    render(<AuthForm mode="login" />);
    expect(screen.getByRole("link", { name: "Sign up" })).toHaveAttribute("href", "/register");
  });

  it("toggles password visibility", async () => {
    const user = await fill("login", "pw");
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "text");
    await user.click(screen.getByRole("button", { name: "Hide password" }));
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
  });

  it("goes home when already signed in", () => {
    useAuth.setState({ status: "authed", token: "tok", email: "a@b.co" });
    render(<AuthForm mode="login" />);
    expect(mockReplace).toHaveBeenCalledWith("/");
  });
});

describe("AuthForm register", () => {
  it("registers, logs in, and goes home", async () => {
    fetchMock
      .mockResolvedValueOnce(reply(201, { id: "1", email: "a@b.co" }))
      .mockResolvedValueOnce(reply(200, { accessToken: jwt("a@b.co") }));
    const user = await fill("register", "password123");
    await user.click(screen.getByRole("button", { name: "Sign up" }));
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/"));
    expect(urls()).toEqual(["/api/auth/register", "/api/auth/login"]);
  });

  it("rejects a short password without calling the server", async () => {
    const user = await fill("register", "short");
    await user.click(screen.getByRole("button", { name: "Sign up" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Password needs at least 8 characters",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows the taken-email error", async () => {
    fetchMock.mockResolvedValueOnce(reply(409));
    const user = await fill("register", "password123");
    await user.click(screen.getByRole("button", { name: "Sign up" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("That email is already registered");
  });

  it("caps the password at 72 characters", () => {
    render(<AuthForm mode="register" />);
    expect(screen.getByLabelText("Password")).toHaveAttribute("maxLength", "72");
    expect(screen.getByLabelText("Password")).toHaveAttribute("autoComplete", "new-password");
  });
});
