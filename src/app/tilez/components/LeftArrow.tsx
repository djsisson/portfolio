import { MouseEventHandler } from "react";
import { ChevronLeft } from "lucide-react";

export default function LeftArrow({
  clickHandler,
}: {
  clickHandler: MouseEventHandler<HTMLDivElement>;
}) {
  return (
    <div
      onClick={clickHandler}
      className={
        "col-start-1 flex scale-150 cursor-pointer grid-cols-subgrid items-center rounded-lg p-4 font-bold uppercase transition delay-150 duration-300 ease-in-out hover:-translate-x-2 hover:scale-150"
      }
    >
      <ChevronLeft
        className="text-blue-500 shadow-blue-500"
        width={36}
        height={36}
      ></ChevronLeft>
    </div>
  );
}
