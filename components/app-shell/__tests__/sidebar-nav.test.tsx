import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SidebarNav } from "@/components/app-shell/sidebar-nav";
import { logout, useAuth } from "@/features/auth/store";
import { renderWithQuery } from "@/test-utils/render-with-query";

jest.mock("@/features/links/api", () => ({
  listLinks: () => Promise.resolve({ content: [], page: { totalElements: 42 } }),
}));
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
    renderWithQuery(<SidebarNav />);
    expect(screen.getByRole("link", { name: "My links" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Shorten" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link", { name: "Settings" })).toHaveAttribute("href", "/app/settings");
  });

  it("shows the link count beside My links", async () => {
    renderWithQuery(<SidebarNav />);
    expect(await screen.findByRole("link", { name: "My links 42" })).toBeInTheDocument();
  });

  it("shows the email and logs out", async () => {
    const user = userEvent.setup();
    renderWithQuery(<SidebarNav />);
    expect(screen.getByText("a@b.co")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Log out" }));
    expect(logout).toHaveBeenCalled();
  });

  it("calls onNavigate when a link is clicked", async () => {
    const user = userEvent.setup();
    const onNavigate = jest.fn();
    renderWithQuery(<SidebarNav onNavigate={onNavigate} />);
    await user.click(screen.getByRole("link", { name: "Settings" }));
    expect(onNavigate).toHaveBeenCalled();
  });
});
