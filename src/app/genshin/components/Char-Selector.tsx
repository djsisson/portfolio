import Image from "next/image";
import { icons } from "../images";
import { genshinData } from "../data";

export default function CharSelector({
  characters,
  currentCharacter,
  setCurrentCharacter,
  characterLoading,
  setCharacterLoading,
}: {
  characters: (typeof genshinData)[0]["characters"];
  currentCharacter: string;
  setCurrentCharacter: React.Dispatch<
    React.SetStateAction<(typeof characters)[0]>
  >;
  characterLoading: boolean;
  setCharacterLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const onClick = (direction: "left" | "right") => {
    const index = characters.findIndex(
      (char) => char.name === currentCharacter,
    );
    if (direction === "left") {
      setCurrentCharacter(
        characters[index - 1 < 0 ? characters.length - 1 : index - 1],
      );
    } else {
      setCurrentCharacter(
        characters[index + 1 >= characters.length ? 0 : index + 1],
      );
    }
    setCharacterLoading(true);
  };
  return (
    <div className="z-20 flex h-full w-full justify-center gap-2">
      <div
        className="hidden h-full items-center p-2 sm:flex"
        onClick={() => onClick("left")}
      >
        <i className="inline-block rotate-45 cursor-pointer border-b-4 border-l-4 border-b-black border-l-black p-3 transition duration-300 ease-in-out hover:scale-125"></i>
      </div>
      <div className="group z-30 flex h-full snap-x snap-mandatory gap-2 overflow-x-auto p-2">
        {characters.map((character) => (
          <div
            key={character.name}
            className={`group-has-hover:grayscale-100 bg-radial-[at_25%_25%] hover:bg-radial-[at_25%_50%] relative z-10 aspect-square h-full rounded-full from-white to-[var(--bgcolour)] to-75% hover:grayscale-0`}
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
              quality={75}
              alt={character.name}
              onClick={() => {
                if (currentCharacter === character.name) return;
                setCurrentCharacter(character);
                setCharacterLoading(true);
              }}
              id={`icon-${character.name}`}
              fill={true}
              sizes="10vw"
              priority={true}
            />
          </div>
        ))}
      </div>
      <div
        className="hidden h-full items-center p-2 sm:flex"
        onClick={() => onClick("right")}
      >
        <i className="-rotate-135 inline-block cursor-pointer border-b-4 border-l-4 border-b-black border-l-black p-3 transition duration-300 ease-in-out hover:scale-125"></i>
      </div>
    </div>
  );
}
