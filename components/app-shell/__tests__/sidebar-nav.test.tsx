import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SidebarNav } from "@/components/app-shell/sidebar-nav";
import { logout, useAuth } from "@/features/auth/store";

jest.mock("next/navigation", () => ({ usePathname: () => "/app/links" }));
jest.mock("@/features/auth/store", () => ({
  ...jest.requireActual("@/features/auth/store"),
  logout: jest.fn(),
}));

beforeEach(() => {
  (logout as jest.Mock).mockReset();
  useAuth.setState({ status: "authed", token: "tok", email: "a@b.co" });
});

describe("SidebarNav", () => {
  it("marks the current page", () => {
    render(<SidebarNav />);
    expect(screen.getByRole("link", { name: "My links" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Shorten" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link", { name: "Settings" })).toHaveAttribute("href", "/app/settings");
  });

  it("shows the email and logs out", async () => {
    const user = userEvent.setup();
    render(<SidebarNav />);
    expect(screen.getByText("a@b.co")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Log out" }));
    expect(logout).toHaveBeenCalled();
  });

  it("calls onNavigate when a link is clicked", async () => {
    const user = userEvent.setup();
    const onNavigate = jest.fn();
    render(<SidebarNav onNavigate={onNavigate} />);
    await user.click(screen.getByRole("link", { name: "Settings" }));
    expect(onNavigate).toHaveBeenCalled();
  });
});
