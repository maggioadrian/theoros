import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "THEOROS — Autonomous Trading Terminal",
  description: "AI-powered algorithmic trading terminal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased overflow-hidden h-screen">{children}</body>
    </html>
  );
}
