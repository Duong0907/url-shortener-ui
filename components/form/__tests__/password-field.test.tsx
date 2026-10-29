import { useState } from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PasswordField } from "@/components/form/password-field";
import { renderInForm } from "@/test-utils/render-in-form";

function Field({ toggle = true }: { toggle?: boolean }) {
  const [shown, setShown] = useState(false);

  return (
    <PasswordField
      name="password"
      label="Password"
      shown={shown}
      onShownChange={setShown}
      toggle={toggle}
    />
  );
}

describe("PasswordField", () => {
  it("hides the text and toggles it with Show and Hide", async () => {
    const user = userEvent.setup();
    renderInForm(<Field />, { defaultValues: { password: "" } });
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "text");
    await user.click(screen.getByRole("button", { name: "Hide password" }));
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
  });

  it("has no toggle button when toggle is false", () => {
    renderInForm(<Field toggle={false} />, { defaultValues: { password: "" } });
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
