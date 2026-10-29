import type { Metadata } from "next";
import { Big_Shoulders, IBM_Plex_Mono, IBM_Plex_Sans_Condensed } from "next/font/google";
import { cn } from "cn";
import { ThemeProvider } from "next-themes";

import { QueryProvider } from "@/components/query-provider";

import "./globals.css";

// Headline, prose and labels, and data (URLs, counts) faces: the wire-room set.
// The opsz axis lets headlines pick Big Shoulders' display cut at large sizes.
const bigShoulders = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin"],
  axes: ["opsz"],
});
const plexCondensed = IBM_Plex_Sans_Condensed({
  variable: "--font-plex-condensed",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

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
        bigShoulders.variable,
        plexCondensed.variable,
        plexMono.variable,
      )}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
