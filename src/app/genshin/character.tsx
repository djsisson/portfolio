"use client";
import { genshin_data } from "./data";
import { backgrounds, icons } from "./images";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Character({
  data,
}: {
  data: Awaited<ReturnType<typeof genshin_data>>;
}) {
  const [currentCity, setCurrentCity] = useState(0);
  const [currentCharacter, setCurrentCharacter] = useState(0);

  return (
    <div
      className={`w-svw h-svh bg-cover bg-center bg-no-repeat absolute left-0 top-0 flex flex-col justify-between`}
      style={{
        backgroundImage: `url(${
          backgrounds[
            data[currentCity].name.toLowerCase() as keyof typeof backgrounds
          ].src
        })`,
      }}
    >
      <header className="z-10">header</header>
      <div>
        {data.map((city, i) => (
          <button key={city.id} onClick={() => setCurrentCity(i)}>
            {city.name}
          </button>
        ))}

        <div className="flex">
          {data[currentCity].characters.map((character, i) => (
            <Image
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
              onClick={() => setCurrentCharacter(i)}
              placeholder="blur"
            />
          ))}
        </div>
      </div>
      <footer>footer</footer>
    </div>
  );
}
