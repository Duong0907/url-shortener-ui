import { render, screen } from "@testing-library/react";

import Home from "@/app/(public)/page";
import { useAuth } from "@/features/auth/store";

const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ replace: mockReplace }) }));

beforeEach(() => {
  mockReplace.mockReset();
  useAuth.setState({ status: "anon", token: null, email: null });
});

describe("Home page", () => {
  it("renders headline and the form", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Long links in. Tidy links out.",
    );
    expect(screen.getByLabelText("URL to shorten")).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("sends signed-in users to the app", () => {
    useAuth.setState({ status: "authed", token: "tok", email: "a@b.co" });
    render(<Home />);
    expect(mockReplace).toHaveBeenCalledWith("/app/shorten");
  });
});
