import { listTodos } from "../actions";

import TodoFilter from "./TodoFilter";
export default async function TodoList() {
  const todos = await listTodos();

  return <TodoFilter todos={todos} />;
}
