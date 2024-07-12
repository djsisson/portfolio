"use client";
import { genshin_data } from "../data";
import { useState, useEffect, useRef } from "react";
import Background from "./Background";
import Profile from "./Profile";
import CitySelector from "./City-Selector";
import CharSelector from "./Char-Selector";
import CharInfo from "./Char-Info";

export default function Character({
  data,
}: {
  data: Awaited<ReturnType<typeof genshin_data>>;
}) {
  const [currentCity, setCurrentCity] = useState(0);
  const [currentCharacter, setCurrentCharacter] = useState(
    {} as Awaited<ReturnType<typeof genshin_data>>[0]["characters"][0],
  );
  const [xdown, setXdown] = useState(0);
  const [ydown, setYdown] = useState(0);
  const [characterLoading, setCharacterLoading] = useState(true);
  const characterRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setCharacterLoading(true);
    setCurrentCharacter(data[currentCity].characters[0]);
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
    setCharacterLoading(true);
    if (Math.abs(xDiff) < Math.abs(yDiff)) {
      if (yDiff > 0) {
        setCurrentCity((city) => (city + 1) % data.length);
      } else {
        setCurrentCity((city) => (city - 1 + data.length) % data.length);
      }
    } else {
      const charIndex = data[currentCity].characters.findIndex(
        (char) => char.name === currentCharacter.name,
      );
      if (xDiff > 0) {
        setCurrentCharacter(
          data[currentCity].characters[
            (charIndex + 1) % data[currentCity].characters.length
          ],
        );
      } else {
        setCurrentCharacter(
          data[currentCity].characters[
            (charIndex - 1 + data[currentCity].characters.length) %
              data[currentCity].characters.length
          ],
        );
      }
    }
  };

  return (
    <>
      <Background currentCity={data[currentCity].name} />
      {currentCharacter.name && (
        <Profile
          currentCharacter={currentCharacter.name}
          handleTouchEnd={handleTouchEnd}
          handleTouchStart={handleTouchStart}
          setCharacterLoading={setCharacterLoading}
        />
      )}
      <div className="absolute top-[20%] left-[25%] h-[30%] w-[30%] max-w-96">
        {currentCharacter.name && <CharInfo character={currentCharacter} />}
      </div>
      <div className="z-10 flex h-full w-full flex-col gap-2 p-4">
        <CitySelector
          cities={data}
          currentCity={currentCity}
          setCurrentCity={setCurrentCity}
        />
        <div className="flex justify-center">
          <CharSelector
            characters={data[currentCity].characters}
            currentCharacter={currentCharacter.name}
            setCurrentCharacter={setCurrentCharacter}
            characterLoading={characterLoading}
            setCharacterLoading={setCharacterLoading}
            characterRef={characterRef}
          />
        </div>
      </div>
    </>
  );
}
