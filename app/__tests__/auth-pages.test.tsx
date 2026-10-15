import { render, screen } from "@testing-library/react";

import LoginPage, { metadata as loginMetadata } from "@/app/login/page";
import RegisterPage, { metadata as registerMetadata } from "@/app/register/page";

jest.mock("next/navigation", () => ({ useRouter: () => ({ replace: jest.fn() }) }));

describe("auth pages", () => {
  it("renders the login form", () => {
    render(<LoginPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Log in");
    expect(loginMetadata.title).toBe("Log in · URL Shortener");
  });

  it("renders the register form", () => {
    render(<RegisterPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Create account");
    expect(registerMetadata.title).toBe("Sign up · URL Shortener");
  });
});
