import Reset from "./Reset";
import Theme from "./Theme";
import UserName from "./UserName";

export default function Header() {
  return (
    <div className="col-start-1 -col-end-1 row-start-1 row-end-2 flex items-center justify-between border-b-5 [border-style:outset] border-[var(--bgcolour)] px-4 z-40">
      <h1 className="text-sm md:text-lg lg:text-3xl">Asteroid Miner</h1>
      <UserName />
      <Reset />
      <Theme />
    </div>
  );
}
