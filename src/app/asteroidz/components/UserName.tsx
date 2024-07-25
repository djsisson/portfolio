"use client";
import {
  useGameState,
  useGameStateDispatch,
  gameStateActionType,
} from "./Context";
import { useState, useRef, useEffect } from "react";

const UserName = () => {
  const [showName, setShowName] = useState(false);
  const userName = useGameState().playerName;
  const dispatch = useGameStateDispatch();
  const ref = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  }, [showName]);

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setShowName(!showName);
    clearTimeout(ref.current);
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.select();
    setShowName(true);
    clearTimeout(ref.current);
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.code == "Enter") {
      setShowName(false);
    }
    clearTimeout(ref.current);
  };

  const onMouseLeave = () => {
    ref.current = setTimeout(() => setShowName(false), 3000);
  };

  const onMouseEnter = () => {
    clearTimeout(ref.current);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: gameStateActionType.CHANGENAME,
      value: e.target.value,
    });
  };

  return (
    <div className="flex items-end gap-4 text-lg italic">
      <div>{userName || "Traveller"}</div>
      <div className="relative">
        <div
          onClick={onClick}
          className="aspect-square h-7 w-7 cursor-pointer border-b-1 border-b-transparent fill-[var(--bgcolour)] text-[var(--bgcolour)] hover:scale-105 hover:border-b-[var(--bgcolour)]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0,0,256,256">
            <g
              fill="currentColor"
              fillRule="nonzero"
              stroke="none"
              strokeWidth="1"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              strokeMiterlimit="10"
              strokeDasharray=""
              strokeDashoffset="0"
              fontFamily="none"
              fontWeight="none"
              fontSize="none"
              textAnchor="none"
            >
              <g transform="scale(8.53333,8.53333)">
                <path d="M22.82813,3c-0.51175,0 -1.02356,0.19544 -1.41406,0.58594l-2.41406,2.41406l5,5l2.41406,-2.41406c0.781,-0.781 0.781,-2.04713 0,-2.82812l-2.17187,-2.17187c-0.3905,-0.3905 -0.90231,-0.58594 -1.41406,-0.58594zM17,8l-11.74023,11.74023c0,0 0.91777,-0.08223 1.25977,0.25977c0.342,0.342 0.06047,2.58 0.48047,3c0.42,0.42 2.64389,0.12436 2.96289,0.44336c0.319,0.319 0.29688,1.29688 0.29688,1.29688l11.74023,-11.74023zM4,23l-0.94336,2.67188c-0.03709,0.10544 -0.05623,0.21635 -0.05664,0.32813c0,0.55228 0.44772,1 1,1c0.11177,-0.00041 0.22268,-0.01956 0.32813,-0.05664c0.00326,-0.00128 0.00652,-0.00259 0.00977,-0.00391l0.02539,-0.00781c0.00196,-0.0013 0.00391,-0.0026 0.00586,-0.00391l2.63086,-0.92773l-1.5,-1.5z"></path>
              </g>
            </g>
          </svg>
        </div>
        {showName ? (
          <div className="fixed top-[10%] left-[35%] z-20 grid w-[30%] grid-cols-4 gap-4 text-black">
            <label
              className="fixed hidden w-[10%] text-[var(--bgcolour)]"
              htmlFor="playername"
            >
              Name:
            </label>
            <input
              ref={inputRef}
              onMouseLeave={onMouseLeave}
              onMouseEnter={onMouseEnter}
              onFocus={(e) => onFocus(e)}
              onChange={(e) => onChange(e)}
              onKeyDown={(e) => onKeyDown(e)}
              className="col-start-1 -col-end-2 row-start-1 row-end-2 rounded-md bg-black p-2 text-white"
              defaultValue={userName || "Traveller"}
              type="text"
              name="Player"
              id="playername"
              maxLength={12}
              minLength={1}
              pattern="^[a-zA-Z0-9_]*$"
            />
            <button
              onClick={() => setShowName(false)}
              className="-col-start-2 -col-end-1 row-start-1 row-end-2 cursor-pointer rounded-md border-1 border-[var(--bgcolour)] bg-black p-2 text-white"
            >
              Ok
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default UserName;
