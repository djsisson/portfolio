import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Todos with RLS",
  description: "Created by DJ Sisson",
};

export default function Todos({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
