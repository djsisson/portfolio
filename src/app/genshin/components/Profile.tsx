import Image from "next/image";
import { portrait } from "@/lib/imgMeta";

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
          portrait[
            `${currentCharacter
              .replace(" ", "_")
              .toLowerCase()}_profile.webp` as keyof typeof portrait
          ].relativePath
        }
        alt={currentCharacter}
        fill={true}
        priority={true}
        onLoad={() => setCharacterLoading(false)}
        sizes="100vw"
        placeholder="blur"
        blurDataURL={
          portrait[
            `${currentCharacter
              .replace(" ", "_")
              .toLowerCase()}_profile.webp` as keyof typeof portrait
          ].imgBase64
        }
      />
    </div>
  );
}
