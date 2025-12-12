"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import asteroid from "@/../public/assets/asteroidz/asteroid.webp";
import {
	calcdamage,
	type stats,
	useGameState,
	useGameStateDispatch,
} from "./Context";
import VisualScore from "./VisualScore";

export type Score = {
	id: number;
	value: number;
	crit: boolean;
	rndLeft: number;
	rndTop: number;
	delay: number;
};

const ViewPort = () => {
	const [clickValues, setClickValues] = useState([] as Score[]);
	const [cpsValues, setCpsValues] = useState([] as Score[]);
	const refTimer = useRef<typeof sendAddCps>(null);
	const refShake = useRef<NodeJS.Timeout>(null);
	const dispatch = useGameStateDispatch();
	const inven = useGameState().items;
	const [clickStats, setClickStats] = useState({} as stats);
	const [cpsStats, setCpsStats] = useState([] as stats[]);
	const [shake, setShake] = useState(false);

	useEffect(() => {
		const newValues = [] as stats[];
		inven.forEach((x) => {
			const stats = {
				baseValue: x.baseValue,
				critChance: x.critChance,
				critDamage: x.critDamage,
			};
			if (x.name === "Click") {
				setClickStats(stats);
			} else {
				for (let i = 0; i < x.quantity; i++) {
					newValues.push(stats);
				}
			}
		});
		setCpsStats(newValues);
	}, [inven]);

	useEffect(() => {
		refTimer.current = sendAddCps;
	});

	useEffect(() => {
		const interval = setInterval(() => {
			if (refTimer.current) refTimer.current();
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	const sendAddCps = () => {
		const updatedAverageDmg = cpsStats.map((x) => ({
			...calcdamage(x),
		}));
		const nextId =
			cpsValues.length === 0
				? 1
				: (cpsValues[cpsValues.length - 1].id + 1) % 1000;
		const cpsToAdd = updatedAverageDmg.map((x, i) => ({
			...x,
			id: i + nextId,
			value: x.totaldamage,
			rndLeft: Math.floor(Math.random() * 40 - 20),
			rndTop: Math.floor(Math.random() * 40 - 20),
			delay: Math.floor(Math.random() * 500),
		}));
		setCpsValues((x) => [...x, ...cpsToAdd]);
		dispatch({
			type: "addCps",
			value: updatedAverageDmg.reduce((i, x) => i + x.totaldamage, 0),
		});
	};

	const onClick = async () => {
		if (refShake.current) clearTimeout(refShake.current);
		setShake(true);
		refShake.current = setTimeout(() => setShake(false), 250);
		const getCalcDamage = calcdamage(clickStats);
		const clickId =
			clickValues.length === 0
				? 1
				: (clickValues[clickValues.length - 1].id + 1) % 100;
		setClickValues((x) => [
			...x,
			{
				id: clickId,
				crit: getCalcDamage.crit,
				value: getCalcDamage.totaldamage,
				rndLeft: Math.floor(Math.random() * 40 - 20),
				rndTop: Math.floor(Math.random() * 40 - 20),
				delay: 0,
			} as Score,
		]);
		dispatch({
			type: "click",
			value: getCalcDamage.totaldamage,
		});
	};

	const removeClickValue = (id: number) => {
		setClickValues((x) => x.filter((i) => i.id !== id));
	};

	const removeCpsValue = (id: number) => {
		setCpsValues((x) => x.filter((i) => i.id !== id));
	};

	return (
		<div className="relative col-start-3 -col-end-3 row-start-2 row-end-7 flex items-center justify-center border-5 [border-style:outset] border-(--bgcolour) select-none">
			{clickValues.map((x) => {
				return (
					<VisualScore
						x={x}
						key={x.id}
						remove={removeClickValue}
						type="Click"
					/>
				);
			})}
			<button
				type="button"
				className="relative aspect-square w-[50%] cursor-pointer object-contain object-center"
				onClick={onClick}
				style={{
					animation: shake ? "shake 0.5s infinite" : "",
				}}
			>
				<Image
					src={asteroid}
					alt="asteroid"
					priority={true}
					className="[-webkit-user-drag:none] [user-drag:none] select-none"
					fill={true}
				/>
			</button>
			{cpsValues.map((x) => {
				return (
					<VisualScore x={x} key={x.id} remove={removeCpsValue} type="Cps" />
				);
			})}
		</div>
	);
};

export default ViewPort;
