import { getUserFromJWT } from "@/utils/auth";
import AddTodo from "./components/AddTodo";
import Header from "./components/Header";
import TodoList from "./components/TodoList";

export default async function Page() {
  const user = await getUserFromJWT();
  return (
    <div className="flex h-svh w-svw flex-col items-center">
      <Header />

      <h2 className="text-2xl font-bold">Todos</h2>
      {user ? (
        <div className="flex max-w-prose flex-1 gap-4 p-4">
          <TodoList />
          <AddTodo />
        </div>
      ) : (
        <div>Please login to view todos</div>
      )}
    </div>
  );
}
