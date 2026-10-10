import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { LinkTag } from "@/features/shorten/link-tag";

const link = {
  id: "1",
  slug: "abc123",
  shortUrl: "http://localhost:8080/abc123",
  targetUrl: "https://example.com",
  active: true,
  createdAt: "2026-10-10T00:00:00Z",
};

describe("LinkTag", () => {
  it("shows an empty tag without a link", () => {
    render(<LinkTag link={null} />);
    expect(screen.getByText("your-link")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Copy" })).not.toBeInTheDocument();
  });

  it("shows the short link, Active and Never for a link without expiry", () => {
    render(<LinkTag link={link} />);
    expect(screen.getByRole("link", { name: link.shortUrl })).toHaveAttribute(
      "href",
      link.shortUrl,
    );
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Never")).toBeInTheDocument();
  });

  it("shows Inactive for an inactive link", () => {
    render(<LinkTag link={{ ...link, active: false }} />);
    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });

  it("shows the expiry date", () => {
    render(<LinkTag link={{ ...link, expiresAt: "2030-01-15T12:00:00Z" }} />);
    expect(screen.getByText(/2030/)).toBeInTheDocument();
    expect(screen.queryByText("Never")).not.toBeInTheDocument();
  });

  it("copies the link and shows Copied", async () => {
    const user = userEvent.setup();
    render(<LinkTag link={link} />);
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(await screen.findByRole("button", { name: "Copied" })).toBeInTheDocument();
    expect(await navigator.clipboard.readText()).toBe(link.shortUrl);
  });
});
