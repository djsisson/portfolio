import { Suspense } from "react";
import Container from "./components/Container";
import { GameStateProvider } from "./components/Context";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { ThemeProvider } from "./components/ThemeProvider";
import Total from "./components/Total";
import ViewPort from "./components/ViewPort";
import { gameObject, gameState } from "./data";

export default async function Asteroidz() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<GameStateProvider _gameState={gameState} _gameObject={gameObject}>
				<ThemeProvider>
					<Header />
					<Container type={"Inventory"} />
					<Container type={"Research"} />
					<Container type={"Upgrades"} />
					<Container type={"Shop"} />
					<ViewPort />
					<Total />
					<Footer />
				</ThemeProvider>
			</GameStateProvider>
		</Suspense>
	);
}
