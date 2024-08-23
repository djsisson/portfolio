import { ChevronRight } from "lucide-react";
import { MouseEventHandler } from "react";

export default function RightArrow({
  clickHandler,
}: {
  clickHandler: MouseEventHandler<HTMLDivElement>;
}) {
  return (
    <div
      onClick={clickHandler}
      className={`flex cursor-pointer grid-cols-subgrid items-center rounded-lg p-4 font-bold uppercase transition delay-150 duration-300 ease-in-out hover:translate-x-2 hover:scale-150`}
    >
      <ChevronRight
        className="scale-150 text-blue-500 shadow-blue-500"
        width={36}
        height={36}
      ></ChevronRight>
    </div>
  );
}
