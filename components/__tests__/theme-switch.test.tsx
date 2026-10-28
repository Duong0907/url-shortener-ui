import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ThemeSwitch } from "@/components/theme-switch";

// jsdom has no PointerEvent; Base UI's switch dispatches one when clicked.
if (!window.PointerEvent) {
  window.PointerEvent = MouseEvent as unknown as typeof PointerEvent;
}

const mockSetTheme = jest.fn();
let mockResolvedTheme = "light";
jest.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: mockResolvedTheme, setTheme: mockSetTheme }),
}));

beforeEach(() => mockSetTheme.mockReset());

describe("ThemeSwitch", () => {
  it("switches from light to dark", async () => {
    mockResolvedTheme = "light";
    render(<ThemeSwitch />);
    const toggle = screen.getByRole("switch", { name: "Dark mode" });
    expect(toggle).not.toBeChecked();
    await userEvent.click(toggle);
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("switches from dark to light", async () => {
    mockResolvedTheme = "dark";
    render(<ThemeSwitch />);
    const toggle = screen.getByRole("switch", { name: "Dark mode" });
    expect(toggle).toBeChecked();
    await userEvent.click(toggle);
    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });
});
