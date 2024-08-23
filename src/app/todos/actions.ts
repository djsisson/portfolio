"use server";
import { getdb as db } from "@/db/todos/db";
import { getUserFromJWT } from "@/lib/auth";
import { JWTPayload } from "jose";
import { todos } from "@/db/todos/schema";
import { desc, eq, not } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addTodo(FormData: FormData) {
  const todo = FormData.get("todo") as string;
  const jwt = await getUserFromJWT();
  if (!jwt) {
    return null;
  }
  const result = await db(jwt as JWTPayload).transaction(async (tx) => {
    const todoList = await tx
      .insert(todos)
      .values({ title: todo, userId: jwt.sub as string })
      .returning()
      .execute();
    return todoList;
  });
  return revalidatePath("/todos");
}

export async function toggleTodo(id: string) {
  const jwt = await getUserFromJWT();
  if (!jwt) {
    return null;
  }

  const result = await db(jwt as JWTPayload).transaction(async (tx) => {
    const todoList = await tx
      .update(todos)
      .set({ completed: not(todos.completed) })
      .where(eq(todos.id, id))
      .execute();
    return todoList;
  });
  return revalidatePath("/todos");
}

export async function deleteTodo(id: string) {
  const jwt = await getUserFromJWT();
  if (!jwt) {
    return null;
  }

  const result = await db(jwt as JWTPayload).transaction(async (tx) => {
    await tx.delete(todos).where(eq(todos.id, id)).execute();
  });

  return revalidatePath("/todos");
}

export async function listTodos() {
  const jwt = await getUserFromJWT();
  if (!jwt) {
    return null;
  }
  const result = await db(jwt as JWTPayload).transaction(async (tx) => {
    const todoList = await tx
      .select()
      .from(todos)
      .orderBy(desc(todos.createdAt))
      .execute();
    return todoList;
  });
  return result;
}
