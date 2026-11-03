import { screen } from "@testing-library/react";

import RegisterPage, { metadata } from "@/app/(public)/register/page";
import { renderWithQuery } from "@/test-utils/render-with-query";

jest.mock("next/navigation", () => ({ useRouter: () => ({ replace: jest.fn() }) }));

const props = (searchParams: Record<string, string | string[] | undefined>) => ({
  params: Promise.resolve({}),
  searchParams: Promise.resolve(searchParams),
});

describe("register page", () => {
  it("renders the register form", async () => {
    renderWithQuery(await RegisterPage(props({})));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Create account");
    expect(metadata.title).toBe("Sign up · Fast Shortener");
  });
});
