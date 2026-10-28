import { render, screen } from "@testing-library/react";

import VerifyEmailPage, { metadata } from "@/app/(public)/verify-email/page";
import { useAuth } from "@/features/auth/store";

jest.mock("next/navigation", () => ({ useRouter: () => ({ replace: jest.fn() }) }));

const props = (searchParams: Record<string, string | string[] | undefined>) => ({
  params: Promise.resolve({}),
  searchParams: Promise.resolve(searchParams),
});

beforeEach(() => {
  global.fetch = jest.fn() as unknown as typeof fetch;
  // Loading: the page renders but does not post, so these tests only check what reaches VerifyEmail.
  useAuth.setState({ status: "loading", token: null, email: null });
});

describe("verify email page", () => {
  it("passes the token to VerifyEmail", async () => {
    render(await VerifyEmailPage(props({ token: "abc" })));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Verify email");
    expect(screen.getByRole("status")).toHaveTextContent("Verifying your email…");
    expect(metadata.title).toBe("Verify email · URL Shortener");
  });

  it.each([{}, { token: "" }, { token: ["a", "b"] }])("treats %j as a missing token", async (q) => {
    render(await VerifyEmailPage(props(q)));
    expect(screen.getByRole("alert")).toHaveTextContent("This link is invalid or has expired.");
  });
});
