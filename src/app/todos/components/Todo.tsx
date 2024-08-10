"use client";

import { CircleCheck, CircleX, Info } from "lucide-react";
import { deleteTodo, toggleTodo } from "../actions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { todos } from "@/db/todos/schema";
export default function Todo({ todo }: { todo: typeof todos.$inferSelect }) {
  return (
    <div className="flex flex-col justify-between gap-2 rounded-lg border-1 p-2">
      <div className="text-wrap break-all select-none">{todo.title}</div>
      <div className="flex items-center justify-between">
        <div className="text-xs italic">{`${todo.createdAt.toLocaleDateString()} ${todo.createdAt.toLocaleTimeString()}`}</div>
        <div className="flex justify-end gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <CircleCheck
                  color={`${todo.completed ? "green" : "gray"}`}
                  onClick={() => toggleTodo(todo.id)}
                  className="cursor-pointer opacity-50 hover:opacity-100"
                />
              </TooltipTrigger>
              <TooltipContent>
                {todo.completed ? "Completed" : "Not completed"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <CircleX
                  className="cursor-pointer opacity-50 hover:opacity-100"
                  color="red"
                  onClick={() => deleteTodo(todo.id)}
                />
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
