import { redirect } from "next/navigation";

import AppIndex from "@/app/app/page";

jest.mock("next/navigation", () => ({ redirect: jest.fn() }));

describe("app index page", () => {
  it("sends /app to Shorten", () => {
    AppIndex();
    expect(redirect).toHaveBeenCalledWith("/app/shorten");
  });
});
