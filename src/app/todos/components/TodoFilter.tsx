"use client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { todos as _todos } from "@/db/todos/schema";
import Todo from "./Todo";

export default function TodoFilter({
  todos,
}: {
  todos: (typeof _todos.$inferSelect)[];
}) {
  const [completed, setCompleted] = useState(false);
  const todoList = todos.filter((todo) => todo.completed == completed);
  return (
    <div className="flex w-full flex-1 flex-col gap-2 p-2">
      <div className="flex items-center space-x-2">
        <Switch
          id="completed"
          checked={completed}
          onCheckedChange={() => setCompleted(!completed)}
        />
        <Label htmlFor="completed">Show Completed</Label>
      </div>
      {todoList.length == 0 ? (
        completed ? (
          <p>No Completed Todos</p>
        ) : (
          <p>Add A New Todo</p>
        )
      ) : null}
      {todos
        .filter((todo) => todo.completed == completed)
        .map((todo) => (
          <Todo key={todo.id} todo={todo as typeof todo} />
        ))}
    </div>
  );
}
