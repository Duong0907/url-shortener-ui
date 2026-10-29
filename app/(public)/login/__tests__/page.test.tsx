import { screen } from "@testing-library/react";

import LoginPage, { metadata } from "@/app/(public)/login/page";
import { renderWithQuery } from "@/test-utils/render-with-query";

jest.mock("next/navigation", () => ({ useRouter: () => ({ replace: jest.fn() }) }));

describe("login page", () => {
  it("renders the login form", () => {
    renderWithQuery(<LoginPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Log in");
    expect(metadata.title).toBe("Log in · URL Shortener");
  });
});
