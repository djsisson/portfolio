import Image from "next/image";
import { icons } from "../images";
import { genshin_data } from "../data";

export default function CharSelector({
  characters,
  currentCharacter,
  setCurrentCharacter,
  characterLoading,
  setCharacterLoading,
  characterRef,
}: {
  characters: Awaited<ReturnType<typeof genshin_data>>[0]["characters"];
  currentCharacter: string;
  setCurrentCharacter: React.Dispatch<
    React.SetStateAction<(typeof characters)[0]>
  >;
  characterLoading: boolean;
  setCharacterLoading: React.Dispatch<React.SetStateAction<boolean>>;
  characterRef: React.RefObject<HTMLImageElement>;
}) {
  return (
    <div className="z-30 flex h-full snap-x snap-mandatory gap-2 overflow-x-hidden p-2">
      {characters.map((character) => (
        <div
          key={character.id}
          className={`relative z-10 aspect-square h-full rounded-full before:absolute before:inset-0 before:z-10 before:w-full before:rounded-full before:bg-[conic-gradient(from_135deg,var(--bgcolour),white,var(--bgcolour))] before:transition-all before:duration-1000 before:content-[''] after:absolute after:inset-0 after:z-20 after:w-full after:rounded-full after:bg-[conic-gradient(from_45deg,var(--bgcolour),white,var(--bgcolour))] after:opacity-0 after:transition-all after:duration-1000 after:content-[''] hover:after:opacity-100`}
          style={
            { "--bgcolour": character.element.colour } as React.CSSProperties
          }
        >
          <Image
            className={`relative z-40 cursor-pointer snap-center rounded-full hover:ring-4 hover:ring-[var(--bgcolour)] ${character.name === currentCharacter && characterLoading && "grayscale-100"} ${character.name === currentCharacter && characterLoading && "animate-pulse"} ${character.name === currentCharacter && "ring-4 ring-[var(--bgcolour)]"}`}
            src={
              icons[
                character.name
                  .replace(" ", "_")
                  .toLowerCase() as keyof typeof icons
              ]
            }
            ref={character.name === currentCharacter ? characterRef : null}
            alt={character.name}
            onClick={() => {
              if (currentCharacter === character.name) return;
              setCurrentCharacter(character);
              setCharacterLoading(true);
            }}
            placeholder="blur"
          />
        </div>
      ))}
    </div>
  );
}
