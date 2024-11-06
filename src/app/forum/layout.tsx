import type { Metadata } from "next";
import Header from "./components/Header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SidePanel } from "./components/SidePanel";
export const metadata: Metadata = {
  title: "Forum",
  description: "Created by DJ Sisson",
};

export default function AsteroidzLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SidebarProvider>
        <SidePanel />
        <div className="relative min-h-svh w-full text-base md:text-lg lg:text-lg xl:text-xl">
          <div className="bg-background sticky top-0 flex">
            <SidebarTrigger />
            <Header></Header>
          </div>

          <main className="flex h-full flex-1 flex-col items-center gap-4 pt-4">
            <div className="h-full w-full max-w-prose">{children}</div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
