import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Asteroid Mining Cookie Clicker",
  description: "Created by DJ Sisson",
};

export default function AsteroidzLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
