"use client";

import { useState, useRef } from "react";
import { addTodo } from "../actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function AddTodo() {
  const [todo, setTodo] = useState("");
  const ref = useRef<HTMLFormElement>(null);
  return (
    <div className="flex h-fit w-full flex-1 flex-col gap-2 rounded-lg p-2">
      <form
        className="flex w-full flex-col gap-2"
        ref={ref}
        action={async (FormData) => {
          await addTodo(FormData);
          setTodo("");
        }}
      >
        <Textarea
          className="w-full resize-none rounded-md border-1 py-1 px-2"
          rows={5}
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          required
          placeholder="Enter a todo"
          maxLength={200}
          minLength={1}
          title="Enter a todo"
          name="todo"
        />
        <Button
          className="max-w-max cursor-pointer"
          variant={"default"}
          type="submit"
        >
          Add Todo
        </Button>
      </form>
    </div>
  );
}
