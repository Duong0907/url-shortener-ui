import { screen } from "@testing-library/react";

import RegisterPage, { metadata } from "@/app/(public)/register/page";
import { renderWithQuery } from "@/test-utils/render-with-query";

jest.mock("next/navigation", () => ({ useRouter: () => ({ replace: jest.fn() }) }));

describe("register page", () => {
  it("renders the register form", () => {
    renderWithQuery(<RegisterPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Create account");
    expect(metadata.title).toBe("Sign up · URL Shortener");
  });
});
