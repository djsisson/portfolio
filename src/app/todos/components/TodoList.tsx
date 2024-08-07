import { listTodos } from "../actions";
import Todo from "./Todo";

export default async function TodoList() {
  const todos = await listTodos();

  return (
    <div className="flex w-full flex-col gap-2">
      {todos.map((todo) => (
        <Todo key={todo.id} todo={todo.title} id={todo.id} />
      ))}
    </div>
  );
}
