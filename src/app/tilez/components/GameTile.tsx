export default function GameTile({
  letter,
  position,
  found,
  active,
}: {
  letter: string;
  position: number;
  found: boolean;
  active: boolean;
}) {
  return (
    <div
      className={`border-border flex grid-cols-subgrid items-center justify-center rounded-lg border border-solid p-3 font-semibold uppercase select-none md:p-4 col-start-${
        position + 2
      } ${found ? "text-background bg-green-500" : active ? "bg-blue-500" : "bg-background"}`}
      key={position}
    >
      {letter}
    </div>
  );
}
