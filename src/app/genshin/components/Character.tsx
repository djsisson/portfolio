"use client";
import { useEffect, useRef, useState } from "react";
import type { Characters, Cities } from "../data";
import Background from "./Background";
import CharInfo from "./Char-Info";
import CharSelector from "./Char-Selector";
import CitySelector from "./City-Selector";
import Profile from "./Profile";

export default function Character({ data }: { data: Cities }) {
	const [currentCity, setCurrentCity] = useState(0);
	const [currentCharacter, setCurrentCharacter] = useState({} as Characters[0]);
	const [xdown, setXdown] = useState(0);
	const [ydown, setYdown] = useState(0);
	const [characterLoading, setCharacterLoading] = useState(true);
	const loadingTimer = useRef<NodeJS.Timeout>(null);

	useEffect(() => {
		setCharacterLoading(true);
		setCurrentCharacter(data[currentCity].characters[0]);
	}, [currentCity, data]);

	useEffect(() => {
		const characterRef = document.getElementById(
			`icon-${currentCharacter.name}`,
		);
		if (characterRef) {
			characterRef.scrollIntoView({
				behavior: "smooth",
				block: "center",
				inline: "center",
			});
		}
	}, [currentCharacter]);

	useEffect(() => {
		if (characterLoading) {
			loadingTimer.current = setTimeout(() => {
				setCharacterLoading(false);
			}, 500);
		}
		return () => {
			if (loadingTimer.current) clearTimeout(loadingTimer.current);
		};
	}, [characterLoading]);

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
			if (yDiff < 0) {
				setCurrentCity((city) => (city + 1) % data.length);
			} else {
				setCurrentCity((city) => (city - 1 + data.length) % data.length);
			}
		} else {
			const charIndex = data[currentCity].characters.findIndex(
				(char) => char.name === currentCharacter.name,
			);
			if (xDiff < 0) {
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
			{data[currentCity].characters.map((char) => (
				<Profile
					key={char.name}
					charName={char.name}
					currentCharacter={currentCharacter.name}
					handleTouchEnd={handleTouchEnd}
					handleTouchStart={handleTouchStart}
				/>
			))}
			<div className="absolute left-[35%] top-[20%] z-20 h-[30%] w-[30%] max-w-96 sm:left-[25%]">
				{currentCharacter.name && <CharInfo character={currentCharacter} />}
			</div>
			<div className="flex h-full w-full flex-col justify-center">
				<CitySelector
					cities={data}
					currentCity={currentCity}
					setCurrentCity={setCurrentCity}
				/>
			</div>
			<div className="z-20 flex h-1/5 max-h-36 justify-center bg-white/20">
				<CharSelector
					characters={data[currentCity].characters}
					currentCharacter={currentCharacter.name}
					setCurrentCharacter={setCurrentCharacter}
					characterLoading={characterLoading}
					setCharacterLoading={setCharacterLoading}
				/>
			</div>
		</>
	);
}
