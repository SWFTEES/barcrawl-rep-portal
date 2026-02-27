import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nevada Senior Bar Crawl - Sales Rep Portal",
  description: "Join our sales team and get paid to promote the biggest senior bar crawl in Nevada. Earn $5 per shirt, $3 per ticket, plus bonuses!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://use.typekit.net" />
        <link rel="stylesheet" href="https://use.typekit.net/lzg5wpk.css" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
