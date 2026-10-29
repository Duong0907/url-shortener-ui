import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CopyButton } from "@/components/copy-button";

describe("CopyButton", () => {
  it("copies the text and says Copied", async () => {
    const user = userEvent.setup();
    render(<CopyButton text="http://localhost:8080/abc" />);
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(await navigator.clipboard.readText()).toBe("http://localhost:8080/abc");
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
  });

  it("passes the class name to the button", () => {
    render(<CopyButton text="x" variant="ghost" size="xs" className="self-start" />);
    expect(screen.getByRole("button", { name: "Copy" })).toHaveClass("self-start");
  });

  it("shows an icon but keeps the label as its name", async () => {
    const user = userEvent.setup();
    render(<CopyButton text="x" icon />);
    expect(screen.queryByText("Copy")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
  });
});
