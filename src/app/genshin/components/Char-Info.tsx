import Image from "next/image";
import { elements } from "../images";
import { genshin_data } from "../data";

export default function CharInfo({
  character,
}: {
  character: Awaited<ReturnType<typeof genshin_data>>[0]["characters"][0];
}) {
  return (
    <div className="flex h-full flex-col">
      <Image
        className="absolute bottom-0 left-0 h-full object-contain opacity-50"
        src={
          elements[
            character.element.name.toLowerCase() as keyof typeof elements
          ]
        }
        alt={character.element.name}
      />
      <h1 className="bg-white/20 p-2 text-2xl backdrop-blur-sm">
        {character.name}
      </h1>
      <div className="h-full overflow-y-auto bg-white/20 p-2 text-black backdrop-blur-sm">
        {character.description.map((desc, i) => (
          <div key={i}>
            <p>{desc}</p>
            {i !== character.description.length - 1 && <br />}
          </div>
        ))}
      </div>
    </div>
  );
}
