import Reset from "./Reset";
import Theme from "./Theme";
import UserName from "./UserName";

export default function Header() {
  return (
    <div className="col-start-1 -col-end-1 row-start-1 row-end-2 flex items-center justify-between border-b-5 [border-style:outset] border-[var(--bgcolour)] p-10">
      <h1 className="text-3xl">Asteroid Miner</h1>
      <UserName />
      <Reset />
      <Theme />
    </div>
  );
}
