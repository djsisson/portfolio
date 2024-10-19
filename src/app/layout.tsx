import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./global.css";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Created by DJ Sisson",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        {/*<Script
          strategy="afterInteractive"
          src="./data.js"
          data-cf-beacon='{"token": "d7471a6eb8864867b7e120a5d7046876"}'
        ></Script>*/}
        <ThemeProvider enableSystem={true} attribute="class">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
