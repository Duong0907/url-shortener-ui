import { render, screen } from "@testing-library/react";

import SettingsPage, { metadata } from "@/app/app/settings/page";

describe("settings page", () => {
  it("renders the placeholder", () => {
    render(<SettingsPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Settings");
    expect(screen.getByText("Nothing here yet.")).toBeInTheDocument();
    expect(metadata.title).toBe("Settings · URL Shortener");
  });
});
