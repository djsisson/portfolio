import { GameStateProvider } from "./components/Context";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Container from "./components/Container";
import { gameObject, gameState } from "./data";
import { Suspense } from "react";
import { ThemeProvider } from "./components/ThemeProvider";
import Total from "./components/Total";
import ViewPort from "./components/ViewPort";

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
