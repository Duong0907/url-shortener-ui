import { act, screen, waitFor } from "@testing-library/react";

import AppLayout from "@/app/app/layout";
import { useAuth } from "@/features/auth/store";
import { renderWithQuery } from "@/test-utils/render-with-query";

const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/app/shorten",
}));

const fetchMock = jest.fn();
beforeEach(() => {
  mockReplace.mockReset();
  fetchMock.mockReset();
  global.fetch = fetchMock as unknown as typeof fetch;
});

const renderLayout = () =>
  renderWithQuery(
    <AppLayout>
      <p>page body</p>
    </AppLayout>,
  );

describe("AppLayout", () => {
  it("sends signed-out users to log in, remembering the page", () => {
    window.history.pushState({}, "", "/app/links?page=2");
    useAuth.setState({ status: "anon", token: null, email: null });
    renderLayout();
    expect(mockReplace).toHaveBeenCalledWith("/login?next=%2Fapp%2Flinks%3Fpage%3D2");
    expect(screen.queryByText("page body")).not.toBeInTheDocument();
  });

  it("renders the page for signed-in users without a refresh", () => {
    useAuth.setState({ status: "authed", token: "tok", email: "a@b.co" });
    renderLayout();
    expect(screen.getByText("page body")).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("goes home after log out", () => {
    useAuth.setState({ status: "authed", token: "tok", email: "a@b.co" });
    renderLayout();
    act(() => useAuth.setState({ status: "anon", token: null, email: null }));
    expect(mockReplace).toHaveBeenCalledWith("/");
  });

  it("restores the session on a fresh load", async () => {
    window.history.pushState({}, "", "/app/shorten");
    useAuth.setState({ status: "loading", token: null, email: null });
    fetchMock.mockResolvedValue({ ok: false, status: 401, json: async () => ({}) });
    renderLayout();
    expect(screen.queryByText("page body")).not.toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith("/api/auth/refresh", expect.anything());
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/login?next=%2Fapp%2Fshorten"));
  });
});
