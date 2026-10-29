import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ResendForm } from "@/features/auth/components/resend-form";
import { renderWithQuery } from "@/test-utils/render-with-query";

// jsdom has no Response, so fetch returns plain objects.
const reply = (status: number, body: unknown = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

const fetchMock = jest.fn();
beforeEach(() => {
  fetchMock.mockReset();
  global.fetch = fetchMock as unknown as typeof fetch;
});

const button = () => screen.getByRole("button", { name: "Resend email" });

describe("ResendForm", () => {
  it("is disabled while the email is blank", async () => {
    const user = userEvent.setup();
    renderWithQuery(<ResendForm />);
    expect(button()).toBeDisabled();
    await user.type(screen.getByLabelText("Email"), "   ");
    expect(button()).toBeDisabled();
  });

  it("rejects an invalid email without calling the server", async () => {
    const user = userEvent.setup();
    renderWithQuery(<ResendForm />);
    await user.type(screen.getByLabelText("Email"), "nope");
    await user.click(button());
    expect(await screen.findByText("Enter a valid email")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends the trimmed email, says so, and stays disabled until the email changes", async () => {
    fetchMock.mockResolvedValueOnce(reply(204)).mockResolvedValueOnce(reply(204));
    const user = userEvent.setup();
    renderWithQuery(<ResendForm />);
    await user.type(screen.getByLabelText("Email"), "a@b.co{Enter}");
    expect(await screen.findByRole("status")).toHaveTextContent("Sent. Check your inbox.");
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/resend-verification",
      expect.objectContaining({ body: JSON.stringify({ email: "a@b.co" }) }),
    );
    expect(button()).toBeDisabled();
    await user.type(screen.getByLabelText("Email"), "m");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(button()).toBeEnabled();
  });

  it("shows the server error and allows a retry", async () => {
    fetchMock.mockResolvedValueOnce(reply(500)).mockResolvedValueOnce(reply(204));
    const user = userEvent.setup();
    renderWithQuery(<ResendForm />);
    await user.type(screen.getByLabelText("Email"), "a@b.co");
    await user.click(button());
    expect(await screen.findByRole("alert")).toHaveTextContent("Something went wrong. Try again");
    await user.click(button());
    expect(await screen.findByRole("status")).toBeInTheDocument();
  });
});
