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
      className={`absolute left-0 top-0 h-svh w-svw overflow-clip ${currentCharacter != charName && "opacity-0"} ${currentCharacter == charName ? "z-20" : "z-0"}`}
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
        placeholder="blur"
      />
    </div>
  );
}
