import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./global.css";

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider enableSystem={true} attribute="class">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
