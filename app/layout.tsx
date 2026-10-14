import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KitchenBox LK | A little taste of home",
  description: "Home-style lunch in Jaffna, ordered on WhatsApp, with connected kitchen and delivery operations.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
