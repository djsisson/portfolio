import { Suspense } from "react";
import Character from "./components/Character";
import { genshin_data, Cities } from "./data";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default async function Genshin() {
  const data = await genshin_data();

  return (
    <div className="relative flex h-svh w-svw flex-col">
      <Header />
      <Suspense fallback="loading">
        <Character data={data as Cities} />
      </Suspense>
      <Footer />
    </div>
  );
}
