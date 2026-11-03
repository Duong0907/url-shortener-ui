import { screen } from "@testing-library/react";

import LoginPage, { metadata } from "@/app/(public)/login/page";
import { renderWithQuery } from "@/test-utils/render-with-query";

jest.mock("next/navigation", () => ({ useRouter: () => ({ replace: jest.fn() }) }));

const props = (searchParams: Record<string, string | string[] | undefined>) => ({
  params: Promise.resolve({}),
  searchParams: Promise.resolve(searchParams),
});

describe("login page", () => {
  it("renders the login form", async () => {
    renderWithQuery(await LoginPage(props({})));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Log in");
    expect(metadata.title).toBe("Log in · Fast Shortener");
  });

  it("passes next and the Google error to the form", async () => {
    renderWithQuery(await LoginPage(props({ next: "/app/links", error: "oauth_failed" })));
    expect(screen.getByRole("alert")).toHaveTextContent("Google sign-in failed. Try again.");
    expect(screen.getByRole("link", { name: "Sign up" })).toHaveAttribute(
      "href",
      "/register?next=%2Fapp%2Flinks",
    );
  });

  it("drops an unsafe next", async () => {
    renderWithQuery(await LoginPage(props({ next: "//evil.com" })));
    expect(screen.getByRole("link", { name: "Sign up" })).toHaveAttribute("href", "/register");
  });
});
