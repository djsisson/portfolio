"use client";
import { genshin_data } from "../data";
import { backgrounds, icons, characters } from "../images";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function Character({
  data,
}: {
  data: Awaited<ReturnType<typeof genshin_data>>;
}) {
  const [currentCity, setCurrentCity] = useState(0);
  const [currentCharacter, setCurrentCharacter] = useState("");
  const [xdown, setXdown] = useState(0);
  const [ydown, setYdown] = useState(0);
  const [characterLoading, setCharacterLoading] = useState(false);
  const characterRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setCharacterLoading(true);
    setCurrentCharacter(data[currentCity].characters[0].name);
  }, [currentCity, data]);

  useEffect(() => {
    if (characterRef.current) {
      characterRef.current!.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [currentCharacter]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setXdown(e.targetTouches[0].clientX);
    setYdown(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const xUp = e.changedTouches[0].clientX;
    const yUp = e.changedTouches[0].clientY;
    const xDiff = xUp - xdown;
    const yDiff = yUp - ydown;
    const threshold = 80;
    if (Math.abs(xDiff) <= threshold && Math.abs(yDiff) <= threshold) {
      return;
    }
    if (Math.abs(xDiff) < Math.abs(yDiff)) {
      if (yDiff > 0) {
        setCurrentCity((city) => (city + 1) % data.length);
      } else {
        setCurrentCity((city) => (city - 1 + data.length) % data.length);
      }
    } else {
      const charIndex = data[currentCity].characters.findIndex(
        (char) => char.name === currentCharacter,
      );
      setCharacterLoading(true);
      if (xDiff > 0) {
        setCurrentCharacter(
          data[currentCity].characters[
            (charIndex + 1) % data[currentCity].characters.length
          ].name,
        );
      } else {
        setCurrentCharacter(
          data[currentCity].characters[
            (charIndex - 1 + data[currentCity].characters.length) %
              data[currentCity].characters.length
          ].name,
        );
      }
    }
  };

  return (
    <>
      <div className="absolute top-0 left-0 z-0 h-svh w-svw overflow-clip">
        <Image
          className={`max-w-none object-cover object-center`}
          key={data[currentCity].name}
          src={
            backgrounds[
              data[currentCity].name.toLowerCase() as keyof typeof backgrounds
            ]
          }
          alt={data[currentCity].name}
          placeholder="blur"
          priority={true}
          fill={true}
        ></Image>
      </div>
      {currentCharacter && (
        <div className="absolute top-0 left-0 h-svh w-svw overflow-clip">
          <Image
            onTouchEnd={(e) => handleTouchEnd(e)}
            onTouchStart={(e) => handleTouchStart(e)}
            key={currentCharacter}
            className="absolute top-0 left-[calc(50%-63vh)] z-0 h-svh w-auto max-w-none object-cover"
            src={
              characters[
                currentCharacter
                  .replace(" ", "_")
                  .toLowerCase() as keyof typeof characters
              ]
            }
            alt={currentCharacter}
            placeholder="blur"
            priority={true}
            onLoad={() => setCharacterLoading(false)}
          />
        </div>
      )}
      <div className="z-10 flex h-full w-full flex-col gap-2 p-4">
        <div className="flex flex-1 flex-col justify-center gap-2">
          {data.map((city, i) => (
            <div
              key={city.id}
              onClick={() => setCurrentCity(i)}
              className={`z-20 w-fit cursor-pointer ${i === currentCity ? "text-blue-500" : "text-white"} hover:text-red-500 md:text-xl lg:text-2xl`}
            >
              {city.name}
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <div className="z-30 flex snap-x snap-mandatory overflow-x-hidden">
            {data[currentCity].characters.map((character, i) => (
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
                  setCurrentCharacter(character.name);
                  setCharacterLoading(true);
                }}
                placeholder="blur"
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
