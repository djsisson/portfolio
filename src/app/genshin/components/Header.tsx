export default function Header() {
  return (
    <div className="z-10 flex items-center gap-4 bg-white/30 p-2 backdrop-blur-sm">
      <h1 className="text-xl font-bold [text-shadow:_-1px_0_black,_0_1px_black,_1px_0_black,_0_-1px_black] md:text-2xl lg:text-3xl">
        Genshin Impact
      </h1>
      <div className="flex gap-4 md:text-lg lg:text-2xl">
        <span className="text-amber-300">
          &#9733;&#9733;&#9733;&#9733;&#9733;
        </span>
        <div className="font-bold [text-shadow:_-1px_0_black,_0_1px_black,_1px_0_black,_0_-1px_black]">
          Characters
        </div>
      </div>
    </div>
  );
}
