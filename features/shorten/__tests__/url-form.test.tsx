import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { UrlForm } from "@/features/shorten/url-form";

function setup(props: Partial<React.ComponentProps<typeof UrlForm>> = {}) {
  const onSubmit = jest.fn();
  render(<UrlForm loading={false} error={null} onSubmit={onSubmit} {...props} />);
  return { onSubmit, user: userEvent.setup() };
}

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
    expect(onSubmit).toHaveBeenCalledWith("https://example.com");
  });

  it("submits on Enter", async () => {
    const { onSubmit, user } = setup();
    await user.type(input(), "https://example.com{Enter}");
    expect(onSubmit).toHaveBeenCalledWith("https://example.com");
  });

  it("locks the input and button while loading", () => {
    setup({ loading: true });
    expect(input()).toHaveAttribute("readonly");
    expect(button("Shortening…")).toBeDisabled();
  });

  it("shows the error as an alert", () => {
    setup({ error: "That URL isn't valid" });
    expect(screen.getByRole("alert")).toHaveTextContent("That URL isn't valid");
  });

  it("shows no alert without an error", () => {
    setup();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
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

    it("is disabled while loading", () => {
      setup({ loading: true });
      expect(paste()).toBeDisabled();
    });
  });
});
