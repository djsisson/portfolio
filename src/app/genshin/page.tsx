import { backgrounds } from "./images";

export default function Genshin({
  searchParams = { ["city"]: "mondstadt" },
}: {
  searchParams: { [city: string]: string | string[] };
}) {
  const background =
    backgrounds[searchParams.city as keyof typeof backgrounds] ??
    backgrounds.mondstadt;

  return (
    <div
      className={`w-svw h-svh bg-cover bg-center bg-no-repeat`}
      style={{ backgroundImage: `url(${background.src})` }}
    >
      {background.src.split("/").pop()?.split(".")[0]}
    </div>
  );
}
