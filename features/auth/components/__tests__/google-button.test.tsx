import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { GoogleButton } from "@/features/auth/components/google-button";

afterEach(() => {
  jest.restoreAllMocks();
  sessionStorage.clear();
});

describe("GoogleButton", () => {
  it("links to Google sign-in", () => {
    render(<GoogleButton />);
    expect(screen.getByRole("link", { name: "Continue with Google" })).toHaveAttribute(
      "href",
      "/api/auth/oauth2/authorization/google",
    );
  });

  it("saves next on click", async () => {
    // jsdom does not navigate and logs "Not implemented: navigation".
    jest.spyOn(console, "error").mockImplementation(() => {});
    render(<GoogleButton next="/app/links" />);
    await userEvent.click(screen.getByRole("link", { name: "Continue with Google" }));
    expect(sessionStorage.getItem("auth:next")).toBe("/app/links");
  });
});
