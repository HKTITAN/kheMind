import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  title: "kheMind — markdown vault, Convex search, MCP for Poke",
  description:
    "Open-source personal knowledge vault: GitHub markdown → Convex full-text search → Streamable HTTP MCP for agents (e.g. Poke).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={instrumentSerif.variable}>
      <body className={instrumentSerif.className}>{children}</body>
    </html>
  );
}
