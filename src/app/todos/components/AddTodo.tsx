"use client";

import { useState, useRef } from "react";
import { addTodo } from "../actions";

export default function AddTodo() {
  const [todo, setTodo] = useState("");
  const ref = useRef<HTMLFormElement>(null);
  return (
    <div className="flex h-fit flex-col gap-2 rounded-lg p-2">
      <form
        ref={ref}
        action={async (FormData) => {
          await addTodo(FormData);
          setTodo("");
        }}
      >
        <textarea
          className="w-full resize-none rounded-md border border-black py-1 px-2"
          rows={5}
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          name="todo"
        />
        <button
          className="w-full cursor-pointer rounded-md border-1 py-1 px-2"
          type="submit"
        >
          Add
        </button>
      </form>
    </div>
  );
}
