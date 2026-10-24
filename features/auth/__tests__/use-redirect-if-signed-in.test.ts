import { renderHook } from "@testing-library/react";

import { useAuth } from "@/features/auth/store";
import { useRedirectIfSignedIn } from "@/features/auth/use-redirect-if-signed-in";

const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ replace: mockReplace }) }));

beforeEach(() => mockReplace.mockReset());

describe("useRedirectIfSignedIn", () => {
  it("sends signed-in users home", () => {
    useAuth.setState({ status: "authed", token: "tok", email: "a@b.co" });
    const { result } = renderHook(() => useRedirectIfSignedIn());
    expect(result.current).toBe("authed");
    expect(mockReplace).toHaveBeenCalledWith("/");
  });

  it.each(["loading", "anon"] as const)("stays when the status is %s", (status) => {
    useAuth.setState({ status, token: null, email: null });
    const { result } = renderHook(() => useRedirectIfSignedIn());
    expect(result.current).toBe(status);
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
