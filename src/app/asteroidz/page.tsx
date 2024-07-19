import { gameObject, gameState } from "./data";

export default async function Asteroidz() {
  const gameObjects = await gameObject();
  const newGameState = await gameState();

  return <div>Asteroidz</div>;
}
