import { render, screen } from "@testing-library/react";

import { FormError } from "@/components/form/form-error";

describe("FormError", () => {
  it("renders nothing without an error", () => {
    const { container } = render(<FormError error={null}>child</FormError>);
    expect(container).toBeEmptyDOMElement();
  });

  it.each([
    ["a string", "Wrong email or password"],
    ["an Error", new Error("Wrong email or password")],
  ])("shows %s as an alert", (_label, error) => {
    render(<FormError error={error} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Wrong email or password");
  });

  it("renders children below the message", () => {
    render(
      <FormError error="Nope">
        <a href="/login">Log in instead</a>
      </FormError>,
    );
    expect(screen.getByRole("link", { name: "Log in instead" })).toBeInTheDocument();
  });
});
