import { renderToStaticMarkup } from "react-dom/server";

import RootLayout, { metadata } from "@/app/layout";

jest.mock("next/font/google", () => ({
  Big_Shoulders: () => ({ variable: "f-display" }),
  IBM_Plex_Sans_Condensed: () => ({ variable: "f-sans" }),
  IBM_Plex_Mono: () => ({ variable: "f-mono" }),
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
    expect(html).toContain("f-display");
    expect(html).toContain("f-mono");
    expect(html).toContain("<p>kid</p>");
    expect(html).not.toContain("SHORTENER");
  });
});
