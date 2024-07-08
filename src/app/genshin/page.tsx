import { Suspense } from "react";
import Character from "./character";
import { genshin_data } from "./data";

export default async function Genshin() {
  const data = await genshin_data();

  return (
    <div className="relative w-svw h-svh">
      <Suspense fallback="loading">
        <Character data={data as Awaited<ReturnType<typeof genshin_data>>} />
      </Suspense>
    </div>
  );
}
