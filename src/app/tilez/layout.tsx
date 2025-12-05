import type { Metadata } from "next";
import Footer from "./components/Footer";
import { GameStateProvider } from "./components/GameContext";
import Header from "./components/Header";

export const metadata: Metadata = {
	title: "Tilez Word Game",
	description: "Created by DJ Sisson",
};

export default function TilezLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex h-svh w-svw flex-col items-center justify-between gap-4">
			<GameStateProvider>
				<Header></Header>
				{children}
				<Footer></Footer>
			</GameStateProvider>
		</div>
	);
}
