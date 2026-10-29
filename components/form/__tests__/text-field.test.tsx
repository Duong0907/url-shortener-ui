import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { z } from "zod";

import { TextField } from "@/components/form/text-field";
import { renderInForm } from "@/test-utils/render-in-form";

const schema = z.object({ name: z.string().min(2, "Name needs 2 characters") });
const defaultValues = { name: "" };

function setup(ui: React.ReactNode, onSubmit = jest.fn()) {
  renderInForm(
    <>
      {ui}
      <button type="submit">Save</button>
    </>,
    { defaultValues, schema, onSubmit },
  );

  return { onSubmit, user: userEvent.setup() };
}

describe("TextField", () => {
  it("links the label to the input and uses the name as the id", () => {
    setup(<TextField name="name" label="Name" />);
    expect(screen.getByLabelText("Name")).toHaveAttribute("id", "name");
  });

  it("uses aria-label when there is no visible label", () => {
    setup(<TextField name="name" aria-label="Your name" />);
    expect(screen.getByLabelText("Your name")).toBeInTheDocument();
  });

  it("writes what the user types into the form", async () => {
    const { onSubmit, user } = setup(<TextField name="name" label="Name" />);
    await user.type(screen.getByLabelText("Name"), "Ada");
    await user.click(screen.getByRole("button", { name: "Save" }));
    await screen.findByLabelText("Name");
    expect(onSubmit).toHaveBeenCalledWith({ name: "Ada" }, expect.anything());
  });

  it("shows no error before submit", async () => {
    const { user } = setup(<TextField name="name" label="Name" />);
    await user.type(screen.getByLabelText("Name"), "a");
    expect(screen.queryByText("Name needs 2 characters")).not.toBeInTheDocument();
  });

  it("shows the error after submit and links it to the input", async () => {
    const { onSubmit, user } = setup(<TextField name="name" label="Name" />);
    await user.type(screen.getByLabelText("Name"), "a");
    await user.click(screen.getByRole("button", { name: "Save" }));
    const input = screen.getByLabelText("Name");
    expect(await screen.findByText("Name needs 2 characters")).toHaveAttribute("id", "name-error");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "name-error");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("clears the error as the user fixes the value", async () => {
    const { user } = setup(<TextField name="name" label="Name" />);
    await user.type(screen.getByLabelText("Name"), "a");
    await user.click(screen.getByRole("button", { name: "Save" }));
    await screen.findByText("Name needs 2 characters");
    await user.type(screen.getByLabelText("Name"), "b");
    expect(screen.queryByText("Name needs 2 characters")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Name")).not.toHaveAttribute("aria-invalid");
  });

  it("is read-only while the form submits", async () => {
    const { user } = setup(
      <TextField name="name" label="Name" />,
      jest.fn(() => new Promise(() => {})),
    );
    await user.type(screen.getByLabelText("Name"), "ab");
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByLabelText("Name")).toHaveAttribute("readonly");
  });

  it("renders the end slot and makes room for it", () => {
    setup(<TextField name="name" label="Name" end={<button type="button">Go</button>} />);
    expect(screen.getByRole("button", { name: "Go" })).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveClass("pr-20");
  });

  it("calls onChange after the value changes", async () => {
    const onChange = jest.fn();
    const { user } = setup(<TextField name="name" label="Name" onChange={onChange} />);
    await user.type(screen.getByLabelText("Name"), "ab");
    expect(onChange).toHaveBeenCalledTimes(2);
  });
});
