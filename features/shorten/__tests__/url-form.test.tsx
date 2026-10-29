import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useAuth } from "@/features/auth/store";
import { UrlForm } from "@/features/shorten/url-form";

function setup(props: Partial<React.ComponentProps<typeof UrlForm>> = {}) {
  const onSubmit = jest.fn<Promise<void>, [{ url: string; slug?: string }]>(async () => {});
  render(<UrlForm error={null} onSubmit={onSubmit} {...props} />);
  return { onSubmit, user: userEvent.setup() };
}

beforeEach(() => {
  useAuth.setState({ status: "authed", token: "tok", email: "a@b.co" });
});

const input = () => screen.getByLabelText("URL to shorten");
const button = (name = "Shorten") => screen.getByRole("button", { name });

describe("UrlForm", () => {
  it("disables Shorten while the input is blank", async () => {
    const { user } = setup();
    expect(button()).toBeDisabled();
    await user.type(input(), "   ");
    expect(button()).toBeDisabled();
  });

  it("submits the trimmed URL on click", async () => {
    const { onSubmit, user } = setup();
    await user.type(input(), "  https://example.com  ");
    await user.click(button());
    expect(onSubmit).toHaveBeenCalledWith({ url: "https://example.com" });
  });

  it("submits on Enter", async () => {
    const { onSubmit, user } = setup();
    await user.type(input(), "https://example.com{Enter}");
    expect(onSubmit).toHaveBeenCalledWith({ url: "https://example.com" });
  });

  it("locks the input, Paste and Shorten while submitting", async () => {
    const { user } = setup({ onSubmit: () => new Promise(() => {}) });
    await user.type(input(), "https://example.com");
    await user.click(button());
    expect(await screen.findByRole("button", { name: "Shortening..." })).toBeDisabled();
    expect(input()).toHaveAttribute("readonly");
    expect(screen.getByRole("button", { name: "Paste" })).toBeDisabled();
  });

  it("shows a field error for a URL without a scheme and does not submit", async () => {
    const { onSubmit, user } = setup();
    await user.type(input(), "example.com");
    await user.click(button());
    expect(
      await screen.findByText("Enter a full URL starting with http:// or https://"),
    ).toBeInTheDocument();
    expect(input()).toHaveAttribute("aria-invalid", "true");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows the error as an alert", () => {
    setup({ error: "That URL isn't valid" });
    expect(screen.getByRole("alert")).toHaveTextContent("That URL isn't valid");
  });

  it("shows no alert without an error", () => {
    setup();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  describe("custom link", () => {
    const toggle = () => screen.getByRole("switch", { name: "Use a custom link" });
    const slug = () => screen.getByLabelText("Custom link");

    it("submits the slug when the switch is on", async () => {
      const { onSubmit, user } = setup();
      await user.type(input(), "https://example.com");
      await user.click(toggle());
      await user.type(slug(), " my-link ");
      await user.click(button());
      expect(onSubmit).toHaveBeenCalledWith({ url: "https://example.com", slug: "my-link" });
    });

    it("omits the slug when the switch was turned off again", async () => {
      const { onSubmit, user } = setup();
      await user.type(input(), "https://example.com");
      await user.click(toggle());
      await user.type(slug(), "my-link");
      await user.click(toggle());
      await user.click(button());
      expect(onSubmit.mock.calls[0][0].slug).toBeUndefined();
    });

    it("asks for a slug when the switch is on and the field is empty", async () => {
      const { onSubmit, user } = setup();
      await user.type(input(), "https://example.com");
      await user.click(toggle());
      await user.click(button());
      expect(await screen.findByText("Enter a custom link or turn this off")).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("shows a field error for an invalid slug and does not submit", async () => {
      const { onSubmit, user } = setup();
      await user.type(input(), "https://example.com");
      await user.click(toggle());
      await user.type(slug(), "ab");
      await user.click(button());
      expect(await screen.findByText("3-32 letters, numbers, - or _")).toBeInTheDocument();
      expect(slug()).toHaveAttribute("aria-invalid", "true");
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("drops the slug for a visitor", async () => {
      useAuth.setState({ status: "anon", token: null, email: null });
      const { onSubmit, user } = setup();
      expect(screen.queryByRole("switch")).not.toBeInTheDocument();
      await user.type(input(), "https://example.com");
      await user.click(button());
      expect(onSubmit.mock.calls[0][0].slug).toBeUndefined();
    });
  });

  describe("Paste button", () => {
    const paste = () => screen.getByRole("button", { name: "Paste" });

    it("fills the input from the clipboard, focuses it, and does not submit", async () => {
      const { onSubmit, user } = setup();
      await navigator.clipboard.writeText("  https://example.com/copied  ");
      await user.click(paste());
      await waitFor(() => expect(input()).toHaveValue("https://example.com/copied"));
      expect(input()).toHaveFocus();
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("leaves the input unchanged when the clipboard is empty", async () => {
      const { user } = setup();
      await user.type(input(), "keep");
      const readText = jest.spyOn(navigator.clipboard, "readText").mockResolvedValue("");
      await user.click(paste());
      await waitFor(() => expect(readText).toHaveBeenCalled());
      await act(async () => {});
      expect(input()).toHaveValue("keep");
    });

    it("shows a message when the clipboard cannot be read", async () => {
      const { user } = setup();
      jest.spyOn(navigator.clipboard, "readText").mockRejectedValue(new Error("denied"));
      await user.click(paste());
      expect(await screen.findByRole("alert")).toHaveTextContent(
        "Can't read the clipboard. Paste it into the field instead",
      );
    });

    it("clears the message once the user types", async () => {
      const { user } = setup();
      jest.spyOn(navigator.clipboard, "readText").mockRejectedValue(new Error("denied"));
      await user.click(paste());
      expect(await screen.findByRole("alert")).toBeInTheDocument();
      await user.type(input(), "h");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });
});
