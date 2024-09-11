import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forum",
  description: "Created by DJ Sisson",
};

export default function AsteroidzLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
