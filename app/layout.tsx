import type { Metadata } from "next";
import { Geist, Source_Serif_4 } from "next/font/google";
import { cn } from "cn";
import { ThemeProvider } from "next-themes";

import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
// The variable makes the font-serif utility (link buttons) resolve to Source Serif 4 too.
const sourceSerif4 = Source_Serif_4({ variable: "--font-source-serif", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "URL Shortener",
  description: "Shorten long links.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "font-sans antialiased scrollbar-gutter-stable",
        geist.variable,
        sourceSerif4.variable,
      )}
      suppressHydrationWarning
    >
      <body className={sourceSerif4.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
