"use client";
import { genshin_data } from "../data";
import { backgrounds, icons, characters } from "../images";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Character({
  data,
}: {
  data: Awaited<ReturnType<typeof genshin_data>>;
}) {
  const [currentCity, setCurrentCity] = useState(0);
  const [currentCharacter, setCurrentCharacter] = useState("");

  useEffect(() => {
    setCurrentCharacter(
      data[currentCity].characters[0].name.replace(" ", "_").toLowerCase()
    );
  }, [currentCity, data]);

  return (
    <>
      <div
        className={`w-svw h-svh bg-cover bg-center bg-no-repeat absolute left-0 top-0 flex flex-col justify-center items-center`}
        style={{
          backgroundImage: `url(${
            backgrounds[
              data[currentCity].name.toLowerCase() as keyof typeof backgrounds
            ].src
          })`,
        }}
      >
        {currentCharacter && (
          <div className="overflow-clip w-svw h-svh absolute">
            <Image
              className="absolute left-[calc(50%-63vh)] top-0 w-auto h-svh z-0 max-w-none"
              src={characters[currentCharacter as keyof typeof characters]}
              alt={currentCharacter}
              placeholder="blur"
              priority={true}
            />
          </div>
        )}
      </div>
      <div className="z-10 flex gap-2 items-center justify-center w-full h-full p-4">
        <div className="flex gap-2 flex-col  ">
          {data.map((city, i) => (
            <div
              key={city.id}
              onClick={() => setCurrentCity(i)}
              className="cursor-pointer hover:text-red-500 z-20"
            >
              {city.name}
            </div>
          ))}
        </div>
        <div className="flex-1 h-full w-full flex items-end justify-center">
          <div className="flex gap-2 items-center justify-center flex-wrap">
            {data[currentCity].characters
              .sort((a, b) => {
                if (a.name < b.name) {
                  return -1;
                } else {
                  return 1;
                }
              })
              .map((character, i) => (
                <Image
                  className="cursor-pointer rounded-full ring-1 ring-white hover:ring-red-500 z-20"
                  key={character.id}
                  src={
                    icons[
                      character.name
                        .replace(" ", "_")
                        .toLowerCase() as keyof typeof icons
                    ]
                  }
                  alt={character.name}
                  width={64}
                  height={64}
                  onClick={() =>
                    setCurrentCharacter(
                      character.name.replace(" ", "_").toLowerCase()
                    )
                  }
                  placeholder="blur"
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
