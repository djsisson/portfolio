import Image from "next/image";
import { elements } from "@/lib/imgMeta";
import { Characters } from "../data";

export default function CharInfo({ character }: { character: Characters[0] }) {
  return (
    <div className="flex h-full flex-col">
      <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center">
        <Image
          className="aspect-square object-contain opacity-50"
          src={
            elements[
              `element_${character.element.name.toLowerCase()}.svg` as keyof typeof elements
            ].relativePath
          }
          alt={character.element.name}
          fill={true}
          priority={true}
          sizes="20vw"
          quality={75}
          placeholder="blur"
          blurDataURL={
            elements[
              `element_${character.element.name.toLowerCase()}.svg` as keyof typeof elements
            ].imgBase64
          }
        />
      </div>
      <div className="bg-white/20 backdrop-blur-sm">
        <h1
          className="border-b-2 border-white/20 bg-gradient-to-b from-white to-[var(--bgcolour)] bg-clip-text p-2 font-bold text-transparent md:text-2xl lg:text-4xl"
          style={
            { "--bgcolour": character.element.colour } as React.CSSProperties
          }
        >
          {character.name}
        </h1>
      </div>

      <div className="h-full overflow-y-auto bg-white/20 p-2 text-black backdrop-blur-sm">
        {character.description.map((desc, i) => (
          <div key={i} className="text-sm font-medium md:text-base lg:text-lg">
            <p>{desc}</p>
            {i !== character.description.length - 1 && <br />}
          </div>
        ))}
      </div>
    </div>
  );
}
