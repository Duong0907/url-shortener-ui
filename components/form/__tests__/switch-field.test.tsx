import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SwitchField, type SwitchFieldProps } from "@/components/form/switch-field";
import { renderInForm } from "@/test-utils/render-in-form";

const toggle = () => screen.getByRole("switch", { name: "Notify me" });

function setup(
  defaultValues = { notify: false },
  props: Partial<SwitchFieldProps> = {},
  onSubmit = jest.fn(),
) {
  renderInForm(
    <>
      <SwitchField name="notify" aria-label="Notify me" {...props} />
      <button>Save</button>
    </>,
    { defaultValues, onSubmit },
  );
  return { onSubmit, user: userEvent.setup() };
}

describe("SwitchField", () => {
  it.each([true, false])("shows the form value %s", (notify) => {
    setup({ notify });
    expect(toggle()).toHaveAttribute("aria-checked", String(notify));
  });

  it("writes the new state to the form", async () => {
    const { onSubmit, user } = setup();
    await user.click(toggle());
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).toHaveBeenCalledWith({ notify: true }, expect.anything());
  });

  it("calls onChange with the new state", async () => {
    const onChange = jest.fn();
    const { user } = setup({ notify: false }, { onChange });
    await user.click(toggle());
    expect(onChange).toHaveBeenCalledWith(true);
    await user.click(toggle());
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it("goes read-only while the form submits", async () => {
    const { user } = setup(
      { notify: false },
      {},
      jest.fn(() => new Promise(() => {})),
    );
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(toggle()).toHaveAttribute("aria-readonly", "true");
  });
});
