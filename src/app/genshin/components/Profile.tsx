import Image from "next/image";
import { portraits } from "../images";

export default function Profile({
  currentCharacter,
  handleTouchEnd,
  handleTouchStart,
  charName,
}: {
  currentCharacter: string;
  handleTouchEnd: (e: React.TouchEvent<HTMLDivElement>) => void;
  handleTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
  charName: string;
}) {
  return (
    <div
      className={`absolute top-0 left-0 h-svh w-svw overflow-clip ${currentCharacter === charName ? "z-20" : "z-0 hidden opacity-0"} `}
    >
      <Image
        onTouchEnd={(e) => handleTouchEnd(e)}
        onTouchStart={(e) => handleTouchStart(e)}
        key={charName}
        quality={75}
        className={`relative left-[calc(50%-63vh)] z-0 h-svh w-auto max-w-none overflow-clip object-cover ${currentCharacter === charName && "animate-slide-in"} bg-transparent`}
        style={{ inset: undefined, width: undefined, height: undefined }}
        src={
          portraits[
            charName.replace(" ", "_").toLowerCase() as keyof typeof portraits
          ]
        }
        alt={charName}
        priority={true}
      />
    </div>
  );
}
