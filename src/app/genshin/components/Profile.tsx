import Image from "next/image";
import { characters } from "../images";

export default function Profile({
  currentCharacter,
  handleTouchEnd,
  handleTouchStart,
  setCharacterLoading,
}: {
  currentCharacter: string;
  handleTouchEnd: (e: React.TouchEvent<HTMLDivElement>) => void;
  handleTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
  setCharacterLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="absolute top-0 left-0 z-20 h-svh w-svw overflow-clip">
      <Image
        onTouchEnd={(e) => handleTouchEnd(e)}
        onTouchStart={(e) => handleTouchStart(e)}
        key={currentCharacter}
        quality={75}
        className="left-[calc(50%-63vh)] z-0 h-svh w-auto max-w-none overflow-clip object-cover"
        style={{ inset: undefined, width: undefined, height: undefined }}
        src={
          characters[
            currentCharacter
              .replace(" ", "_")
              .toLowerCase() as keyof typeof characters
          ]
        }
        alt={currentCharacter}
        fill={true}
        priority={true}
        onLoad={() => setCharacterLoading(false)}
      />
    </div>
  );
}
