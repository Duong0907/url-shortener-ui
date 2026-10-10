import { render, screen } from "@testing-library/react";

import Home from "@/app/page";

describe("Home page", () => {
  it("renders headline and the form", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Long links in.Tidy tags out.",
    );
    expect(screen.getByLabelText("URL to shorten")).toBeInTheDocument();
  });
});
