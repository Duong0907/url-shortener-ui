import { render, screen } from "@testing-library/react";

import RegisterPage, { metadata } from "@/app/(public)/register/page";

jest.mock("next/navigation", () => ({ useRouter: () => ({ replace: jest.fn() }) }));

describe("register page", () => {
  it("renders the register form", () => {
    render(<RegisterPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Create account");
    expect(metadata.title).toBe("Sign up · URL Shortener");
  });
});
