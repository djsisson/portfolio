import { backgrounds } from "./images";

export default function Genshin() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${backgrounds.inazuma.src})`,
        backgroundSize: "cover",
      }}
    >
      Genshin
    </div>
  );
}
