import { GameStateProvider } from "./components/Context";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Container from "./components/Container";
import { gameObject, gameState } from "./data";
import { Suspense } from "react";
import { ThemeProvider } from "./components/ThemeProvider";
import Total from "./components/Total";
import ViewPort from "./components/ViewPort";

enum containerType {
  Inventory = "Inventory",
  Research = "Research",
  Upgrades = "Upgrades",
  Shop = "Shop",
}

export default async function Asteroidz() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GameStateProvider _gameState={gameState} _gameObject={gameObject}>
        <ThemeProvider>
          <Header />
          <Container type={containerType.Inventory} />
          <Container type={containerType.Research} />
          <Container type={containerType.Upgrades} />
          <Container type={containerType.Shop} />
          <ViewPort />
          <Total />
          <Footer />
        </ThemeProvider>
      </GameStateProvider>
    </Suspense>
  );
}
