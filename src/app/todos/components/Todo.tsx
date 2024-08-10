"use client";

import { deleteTodo } from "../actions";
import { Button } from "@/components/ui/button";

export default function Todo({ todo, id }: { todo: string; id: string }) {
  return (
    <div className="flex justify-between gap-2 rounded-lg border-1 p-2">
      <div className="text-wrap break-all select-none">{todo}</div>
      <div>
        <Button
          variant={"destructive"}
          className="cursor-pointer rounded-full"
          onClick={() => deleteTodo(id)}
        >
          X
        </Button>
      </div>
    </div>
  );
}
