import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ResendButton } from "@/features/auth/components/resend-button";

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

const button = () => screen.getByRole("button", { name: /Resend email|Sending…/ });

describe("ResendButton", () => {
  it("sends and stays disabled", async () => {
    fetchMock.mockResolvedValueOnce(reply(204));
    render(<ResendButton email=" a@b.co " />);
    await userEvent.click(button());
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Sent. Check your inbox. Use the link in the newest email.",
    );
    expect(button()).toBeDisabled();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/resend-verification",
      expect.objectContaining({ body: JSON.stringify({ email: "a@b.co" }) }),
    );
  });

  it("shows the error and allows a retry", async () => {
    fetchMock.mockResolvedValueOnce(reply(400)).mockResolvedValueOnce(reply(204));
    render(<ResendButton email="a@b.co" />);
    await userEvent.click(button());
    expect(await screen.findByRole("alert")).toHaveTextContent("Enter a valid email");
    expect(button()).toBeEnabled();
    await userEvent.click(button());
    expect(await screen.findByRole("status")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("is disabled without an email", () => {
    render(<ResendButton email="  " />);
    expect(button()).toBeDisabled();
  });
});
