import { gameObjectDB, gameStateDB } from "./data";

export default async function Asteroidz() {
  const gameObjects = await gameObjectDB();
  const newGameState = await gameStateDB();

  return <div>Asteroidz</div>;
}
