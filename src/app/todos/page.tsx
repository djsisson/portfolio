import { getUser } from "@/lib/auth-client";
import AddTodo from "./components/AddTodo";
import Header from "./components/Header";
import TodoList from "./components/TodoList";

export default async function Page() {
  const user = await getUser();
  return (
    <div className="flex h-svh w-svw flex-col items-center">
      <Header />
      {user ? (
        <div className="grid w-full max-w-prose min-w-96 flex-1 grid-cols-2 p-4">
          <TodoList />
          <AddTodo />
        </div>
      ) : (
        <div>Please login to view todos</div>
      )}
    </div>
  );
}
