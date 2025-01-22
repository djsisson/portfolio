import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "./global.css";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Created by DJ Sisson",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce");
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider enableSystem={true} attribute="class" nonce={nonce!}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
