import Image from "next/image";
import { portraits } from "../images";

export default function Profile({
  currentCharacter,
  handleTouchEnd,
  handleTouchStart,
  setCharacterLoading,
  charName,
}: {
  currentCharacter: string;
  handleTouchEnd: (e: React.TouchEvent<HTMLDivElement>) => void;
  handleTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
  setCharacterLoading: React.Dispatch<React.SetStateAction<boolean>>;
  charName: string;
}) {
  return (
    <div
      className={`absolute left-0 top-0 z-20 h-svh w-svw overflow-clip ${currentCharacter != charName && "hidden"}`}
    >
      <Image
        onTouchEnd={(e) => handleTouchEnd(e)}
        onTouchStart={(e) => handleTouchStart(e)}
        key={charName}
        quality={75}
        className={`left-[calc(50%-63vh)] z-0 h-svh w-auto max-w-none overflow-clip object-cover ${currentCharacter == charName && "animate-slide-in"}`}
        style={{ inset: undefined, width: undefined, height: undefined }}
        src={
          portraits[
            charName.replace(" ", "_").toLowerCase() as keyof typeof portraits
          ]
        }
        alt={charName}
        fill={true}
        priority={currentCharacter == charName}
        // onLoad={(e) => {
        //   setCharacterLoading(false);
        //   e.currentTarget.classList.add("animate-slide-in");
        //   e.currentTarget.classList.remove("opacity-0");
        // }}
        placeholder="blur"
      />
    </div>
  );
}
