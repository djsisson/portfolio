import Image from "next/image";
import { backgrounds } from "@/lib/imgMeta";

export default function Background({ currentCity }: { currentCity: string }) {
  const cdn = process.env.NEXT_PUBLIC_CDN || "";
  return (
    <div className="absolute top-0 left-0 z-0 h-svh w-svw overflow-clip">
      <Image
        className={`max-w-none object-cover object-center`}
        key={currentCity}
        src={`${cdn}${backgrounds[`${currentCity.toLowerCase()}.webp` as keyof typeof backgrounds].relativePath}`}
        alt={currentCity}
        priority={true}
        fill={true}
        quality={75}
        sizes="100vw"
        placeholder="blur"
        blurDataURL={
          backgrounds[
            `${currentCity.toLowerCase()}.webp` as keyof typeof backgrounds
          ].imgBase64
        }
      ></Image>
    </div>
  );
}
