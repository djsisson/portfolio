import { Suspense } from "react";
import Character from "./components/Character";
import { genshinData as data } from "./data";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default async function Genshin() {
  return (
    <div className="relative flex h-svh w-svw flex-col">
      <Header />
      <Suspense fallback="loading">
        <Character data={data} />
      </Suspense>
      <Footer />
    </div>
  );
}
