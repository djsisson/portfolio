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
    <div className="z-30 flex snap-x snap-mandatory overflow-x-hidden">
      {characters.map((character) => (
        <Image
          className={`z-20 m-2 cursor-pointer snap-center rounded-full ring-1 ${character.name === currentCharacter ? (characterLoading ? "ring-blue-500" : "ring-green-500") : "ring-white"} hover:ring-red-500`}
          key={character.id}
          src={
            icons[
              character.name
                .replace(" ", "_")
                .toLowerCase() as keyof typeof icons
            ]
          }
          ref={character.name === currentCharacter ? characterRef : null}
          alt={character.name}
          width={64}
          height={64}
          onClick={() => {
            if (currentCharacter === character.name) return;
            setCurrentCharacter(character);
            setCharacterLoading(true);
          }}
          placeholder="blur"
        />
      ))}
    </div>
  );
}
