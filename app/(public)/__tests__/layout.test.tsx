import { renderToStaticMarkup } from "react-dom/server";

import PublicLayout from "@/app/(public)/layout";

describe("PublicLayout", () => {
  // jsdom has no matchMedia; next-themes reads it while rendering.
  beforeAll(() => {
    window.matchMedia = (() => ({ matches: false })) as unknown as typeof window.matchMedia;
  });

  it("renders nav, footer and children", () => {
    const html = renderToStaticMarkup(
      <PublicLayout>
        <p>kid</p>
      </PublicLayout>,
    );
    expect(html).toContain("<p>kid</p>");
    expect(html).toContain('href="/"');
    expect(html).toContain("SHORTENER");
    expect(html).toContain('aria-label="Dark mode"');
    expect(html).toContain(`Shortener @ ${new Date().getFullYear()}`);
  });
});
