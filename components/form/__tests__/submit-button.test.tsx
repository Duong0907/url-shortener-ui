import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SubmitButton } from "@/components/form/submit-button";
import { renderInForm } from "@/test-utils/render-in-form";

const defaultValues = {};

describe("SubmitButton", () => {
  it("shows the label and is enabled when idle", () => {
    renderInForm(<SubmitButton busy="Saving…">Save</SubmitButton>, { defaultValues });
    expect(screen.getByRole("button", { name: "Save" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("type", "submit");
  });

  it("shows the busy label and disables while the form submits", async () => {
    const user = userEvent.setup();
    renderInForm(<SubmitButton busy="Saving…">Save</SubmitButton>, {
      defaultValues,
      onSubmit: () => new Promise(() => {}),
    });
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByRole("button", { name: "Saving…" })).toBeDisabled();
  });

  it("stays busy while pending is set", () => {
    renderInForm(
      <SubmitButton busy="Saving…" pending>
        Save
      </SubmitButton>,
      { defaultValues },
    );
    expect(screen.getByRole("button", { name: "Saving…" })).toBeDisabled();
  });

  it("honors the disabled prop", () => {
    renderInForm(
      <SubmitButton busy="Saving…" disabled>
        Save
      </SubmitButton>,
      { defaultValues },
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });
});
