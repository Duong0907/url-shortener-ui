import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { z } from "zod";

import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { renderInForm } from "@/test-utils/render-in-form";

const schema = z.object({ email: z.email("Enter a valid email") });

function setup(onSubmit = jest.fn()) {
  const { container } = renderInForm(
    <>
      <TextField name="email" label="Email" />
      <SubmitButton busy="Saving…">Save</SubmitButton>
    </>,
    { defaultValues: { email: "" }, schema, onSubmit },
  );

  return { container, onSubmit, user: userEvent.setup() };
}

describe("Form", () => {
  it("turns browser validation off so Zod messages show instead", () => {
    const { container } = setup();
    expect(container.querySelector("form")).toHaveAttribute("novalidate");
  });

  it("gives its fields and button the form through context", async () => {
    const { onSubmit, user } = setup();
    await user.type(screen.getByLabelText("Email"), "a@b.co");
    await user.click(screen.getByRole("button", { name: "Save" }));
    await screen.findByRole("button", { name: "Save" });
    expect(onSubmit).toHaveBeenCalledWith({ email: "a@b.co" }, expect.anything());
  });

  it("does not submit while the schema fails, and submits on Enter once it passes", async () => {
    const { onSubmit, user } = setup();
    await user.type(screen.getByLabelText("Email"), "nope{Enter}");
    expect(await screen.findByText("Enter a valid email")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
    await user.clear(screen.getByLabelText("Email"));
    await user.type(screen.getByLabelText("Email"), "a@b.co{Enter}");
    await screen.findByRole("button", { name: "Save" });
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
