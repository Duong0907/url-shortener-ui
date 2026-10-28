import { renderToStaticMarkup } from "react-dom/server";

import RootLayout, { metadata } from "@/app/layout";

jest.mock("next/font/google", () => ({
  Geist: () => ({ variable: "f-sans" }),
  Source_Serif_4: () => ({ className: "f-serif", variable: "f-serif-var" }),
}));
jest.mock("@/app/globals.css", () => ({}), { virtual: true });

describe("RootLayout", () => {
  // jsdom has no matchMedia; next-themes reads it while rendering.
  beforeAll(() => {
    window.matchMedia = (() => ({ matches: false })) as unknown as typeof window.matchMedia;
  });

  it("exports metadata", () => {
    expect(metadata.title).toBe("URL Shortener");
  });

  it("renders fonts and children", () => {
    const html = renderToStaticMarkup(
      <RootLayout {...({ children: <p>kid</p> } as React.ComponentProps<typeof RootLayout>)} />,
    );
    expect(html).toContain('lang="en"');
    expect(html).toContain("f-sans");
    expect(html).toContain("f-serif-var");
    expect(html).toContain('class="f-serif"');
    expect(html).toContain("<p>kid</p>");
    expect(html).not.toContain("SHORTENER");
  });
});
