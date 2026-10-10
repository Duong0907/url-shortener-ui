import { renderToStaticMarkup } from "react-dom/server";

import RootLayout, { metadata } from "@/app/layout";

jest.mock("next/font/google", () => ({
  Bricolage_Grotesque: () => ({ variable: "f-display" }),
  Instrument_Sans: () => ({ variable: "f-body" }),
  JetBrains_Mono: () => ({ variable: "f-code" }),
}));
jest.mock("@/app/globals.css", () => ({}), { virtual: true });

describe("RootLayout", () => {
  it("exports metadata", () => {
    expect(metadata.title).toBe("URL Shortener");
  });

  it("renders html with font classes and children", () => {
    const html = renderToStaticMarkup(
      <RootLayout {...({ children: <p>kid</p> } as React.ComponentProps<typeof RootLayout>)} />,
    );
    expect(html).toContain('lang="en"');
    expect(html).toContain("f-display f-body f-code");
    expect(html).toContain("<p>kid</p>");
  });
});
