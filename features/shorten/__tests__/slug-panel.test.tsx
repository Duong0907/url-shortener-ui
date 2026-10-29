import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";

import { Form } from "@/components/form/form";
import { useAuth } from "@/features/auth/store";
import { SlugPanel } from "@/features/shorten/slug-panel";

function Harness() {
  const form = useForm({ defaultValues: { custom: false, slug: "" } });

  return (
    <Form form={form} onSubmit={() => {}}>
      <SlugPanel />
    </Form>
  );
}

const toggle = () => screen.getByRole("switch", { name: "Use a custom link" });
const field = () => screen.queryByLabelText("Custom link");

function setup(status: "loading" | "anon" | "authed") {
  useAuth.setState({ status, token: null, email: null });
  render(<Harness />);
  return userEvent.setup();
}

describe("SlugPanel", () => {
  it("hides the field while the switch is off", () => {
    setup("authed");
    expect(toggle()).not.toBeChecked();
    expect(field()).not.toBeInTheDocument();
  });

  it("shows the field and its rule when the switch is on", async () => {
    const user = setup("authed");
    await user.click(toggle());
    expect(field()).toBeInTheDocument();
    expect(screen.getByText("3-32 letters, numbers, - or _")).toBeInTheDocument();
  });

  it("hides the field again when the switch is turned off", async () => {
    const user = setup("authed");
    await user.click(toggle());
    await user.click(toggle());
    expect(field()).not.toBeInTheDocument();
  });

  it("focuses the field when the switch turns on", async () => {
    const user = setup("authed");
    await user.click(toggle());
    expect(field()).toHaveFocus();
  });

  it("shows only a log in link for a visitor", () => {
    setup("anon");
    expect(screen.queryByRole("switch")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute("href", "/login");
  });

  it("locks the switch without a log in link while the session loads", () => {
    setup("loading");
    expect(toggle()).toHaveAttribute("aria-disabled", "true");
    expect(screen.queryByRole("link", { name: "Log in" })).not.toBeInTheDocument();
  });
});
