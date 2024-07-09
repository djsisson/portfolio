import { Suspense } from "react";
import Character from "./components/Character";
import { genshin_data } from "./data";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default async function Genshin() {
  const data = await genshin_data();

  return (
    <div className="relative w-svw h-svh flex flex-col">
      <Header />
      <div className="flex-1">
        <Suspense fallback="loading">
          <Character data={data as Awaited<ReturnType<typeof genshin_data>>} />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
