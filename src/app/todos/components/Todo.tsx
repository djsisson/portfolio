"use client";

import { CircleCheck, CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { todos } from "@/db/todos/schema";
import { deleteTodo, toggleTodo } from "../actions";
export default function Todo({ todo }: { todo: typeof todos.$inferSelect }) {
	const [currentDate, setCurrentDate] = useState("");
	const [currentTime, setCurrentTime] = useState("");
	useEffect(() => {
		setCurrentDate(todo.createdAt.toLocaleDateString());
		setCurrentTime(todo.createdAt.toLocaleTimeString());
	}, [todo.createdAt]);
	return (
		<div className="flex flex-col justify-between gap-2 rounded-lg border-1 p-2">
			<div className="text-wrap break-all select-none">{todo.title}</div>
			<div className="flex items-center justify-between">
				<div className="text-xs italic">{`${currentDate} ${currentTime}`}</div>
				<div className="flex justify-end gap-1">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<CircleCheck
									onClick={() => toggleTodo(todo.id)}
									className={`cursor-pointer ${todo.completed ? "text-green-500" : "text-gray-500"} opacity-50 hover:opacity-100 ${todo.completed ? "hover:text-gray-500" : "hover:text-green-500"}`}
								/>
							</TooltipTrigger>
							<TooltipContent>
								{todo.completed ? "Uncomplete Todo" : "Complete Todo"}
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
							<TooltipContent>Delete Todo</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</div>
		</div>
	);
}
