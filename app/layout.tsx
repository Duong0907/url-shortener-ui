import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "cn";
import { ThemeProvider } from "next-themes";

import { QueryProvider } from "@/components/query-provider";

import "./globals.css";

// One face for everything, as in the Figma dashboard.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fast Shortener",
  description: "Shorten long links.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("font-sans antialiased scrollbar-gutter-stable", inter.variable)}
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
