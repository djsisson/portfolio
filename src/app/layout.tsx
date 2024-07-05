import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Created by DJ Sisson",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
