"use client";

import { deleteTodo } from "../actions";

export default function Todo({ todo, id }: { todo: string; id: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border-1 p-2">
      <div className="text-wrap">{todo}</div>
      <div>
        <button
          className="cursor-pointer rounded-full bg-red-500 py-1 px-2 text-white hover:bg-red-700"
          onClick={() => deleteTodo(id)}
        >
          X
        </button>
      </div>
    </div>
  );
}
