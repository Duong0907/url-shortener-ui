import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AppShell } from "@/components/app-shell/app-shell";
import { useAuth } from "@/features/auth/store";

jest.mock("next/navigation", () => ({ usePathname: () => "/app/shorten" }));

beforeEach(() => useAuth.setState({ status: "authed", token: "tok", email: "a@b.co" }));

describe("AppShell", () => {
  it("renders the sidebar and the page", () => {
    render(
      <AppShell>
        <p>page body</p>
      </AppShell>,
    );
    expect(screen.getByText("page body")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "My links" })).toBeInTheDocument();
  });

  it("opens the drawer and closes it when a link is picked", async () => {
    const user = userEvent.setup();
    render(
      <AppShell>
        <p>page body</p>
      </AppShell>,
    );
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const drawer = await screen.findByRole("dialog", { name: "Menu" });
    await user.click(within(drawer).getByRole("link", { name: "Settings" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});
