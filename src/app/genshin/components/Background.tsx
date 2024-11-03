import Image from "next/image";
import { backgrounds } from "../images";

export default function Background({ currentCity }: { currentCity: string }) {
  return (
    <div className="absolute top-0 left-0 z-0 h-svh w-svw overflow-clip">
      <Image
        className={`max-w-none object-cover object-center`}
        key={currentCity}
        src={backgrounds[currentCity.toLowerCase() as keyof typeof backgrounds]}
        alt={currentCity}
        priority={true}
        fill={true}
        placeholder="blur"
      ></Image>
    </div>
  );
}
