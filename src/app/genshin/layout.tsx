import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Genshin Impact Character Viewer",
  description: "Created by DJ Sisson",
};

export default function GenshinLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
