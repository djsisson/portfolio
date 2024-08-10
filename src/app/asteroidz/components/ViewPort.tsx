"use client";

import { useState, useEffect, useRef } from "react";
import {
  useGameState,
  calcdamage,
  useGameStateDispatch,
  gameStateActionType,
  stats,
} from "./Context";
import VisualScore from "./VisualScore";
import Asteroidz from "@/assets/asteroidz/asteroid.webp";
import Image from "next/image";

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
  const refTimer = useRef<typeof sendAddCps>();
  const refShake = useRef<NodeJS.Timeout>();
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
      if (x.name == "Click") {
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
      cpsValues.length == 0
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
      type: gameStateActionType.ADDCPS,
      value: updatedAverageDmg.reduce((i, x) => i + x.totaldamage, 0),
    });
  };

  const onClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (refShake.current) clearTimeout(refShake.current);
    setShake(true);
    refShake.current = setTimeout(() => setShake(false), 250);
    e.stopPropagation();
    const getCalcDamage = calcdamage(clickStats);
    const clickId =
      clickValues.length == 0
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
      type: gameStateActionType.CLICK,
      value: getCalcDamage.totaldamage,
    });
  };

  const removeClickValue = (id: number) => {
    setClickValues((x) => x.filter((i) => i.id != id));
  };

  const removeCpsValue = (id: number) => {
    setCpsValues((x) => x.filter((i) => i.id != id));
  };

  return (
    <div className="relative col-start-3 -col-end-3 row-start-2 row-end-7 flex items-center justify-center border-5 [border-style:outset] border-[var(--bgcolour)] select-none">
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
      <div
        className="aspect-square w-[50%] cursor-pointer object-contain object-center"
        onClick={onClick}
        style={{
          animation: shake ? "shake 0.5s infinite" : "",
        }}
      >
        <Image
          src={Asteroidz}
          alt="asteroid"
          priority={true}
          className="[-webkit-user-drag:none] [user-drag:none] select-none"
        />
      </div>
      {cpsValues.map((x) => {
        return (
          <VisualScore x={x} key={x.id} remove={removeCpsValue} type="Cps" />
        );
      })}
    </div>
  );
};

export default ViewPort;
