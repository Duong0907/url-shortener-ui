import { StrictMode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useAuth } from "@/features/auth/store";
import { UserMenu } from "@/features/auth/user-menu";

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

describe("UserMenu", () => {
  it("renders nothing until the session check ends", async () => {
    fetchMock.mockResolvedValueOnce(reply(401));
    const { container } = render(<UserMenu />);
    expect(container).toBeEmptyDOMElement();
    // Let the refresh settle so the next test starts clean.
    await screen.findByRole("link", { name: "Log in" });
  });

  it("shows log in and sign up links when anonymous", async () => {
    fetchMock.mockResolvedValueOnce(reply(401));
    render(<UserMenu />);
    expect(await screen.findByRole("link", { name: "Log in" })).toHaveAttribute("href", "/login");
    expect(screen.getByRole("link", { name: "Sign up" })).toHaveAttribute("href", "/register");
  });

  it("shows the email and logs out", async () => {
    fetchMock
      .mockResolvedValueOnce(reply(200, { accessToken: jwt("a@b.co") }))
      .mockResolvedValueOnce(reply(204));
    render(<UserMenu />);
    expect(await screen.findByText("a@b.co")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Log out" }));
    expect(await screen.findByRole("link", { name: "Log in" })).toBeInTheDocument();
  });

  it("sends only one refresh under Strict Mode", async () => {
    fetchMock.mockResolvedValue(reply(401));
    render(
      <StrictMode>
        <UserMenu />
      </StrictMode>,
    );
    await screen.findByRole("link", { name: "Log in" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
