"use server";
import { getdb as db } from "@/db/todos/db";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";
import { JWTPayload } from "jose";
import { todos } from "@/db/todos/schema";
import { desc, eq, not } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addTodo(FormData: FormData) {
  const todo = FormData.get("todo") as string;
  const jwt = cookies().get("access_token")?.value;
  if (!jwt) {
    return null;
  }
  const decodedJwt = await verifyJWT(jwt);
  if (!decodedJwt) {
    return null;
  }
  const result = await db(decodedJwt as JWTPayload).transaction(async (tx) => {
    const todoList = await tx
      .insert(todos)
      .values({ title: todo, userId: decodedJwt.sub as string })
      .returning()
      .execute();
    return todoList;
  });
  return revalidatePath("/todos");
}

export async function toggleTodo(id: string) {
  const jwt = cookies().get("access_token")?.value;
  if (!jwt) {
    return null;
  }
  const decodedJwt = await verifyJWT(jwt);
  if (!decodedJwt) {
    return null;
  }

  const result = await db(decodedJwt as JWTPayload).transaction(async (tx) => {
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
  const jwt = cookies().get("access_token")?.value;
  if (!jwt) {
    return null;
  }
  const decodedJwt = await verifyJWT(jwt);
  if (!decodedJwt) {
    return null;
  }

  const result = await db(decodedJwt as JWTPayload).transaction(async (tx) => {
    await tx.delete(todos).where(eq(todos.id, id)).execute();
  });

  return revalidatePath("/todos");
}

export async function listTodos() {
  const jwt = cookies().get("access_token")?.value;

  if (!jwt) {
    return [];
  }
  const decodedJwt = await verifyJWT(jwt);
  if (!decodedJwt) {
    return [];
  }
  const result = await db(decodedJwt as JWTPayload).transaction(async (tx) => {
    const todoList = await tx
      .select()
      .from(todos)
      .orderBy(desc(todos.createdAt))
      .execute();
    return todoList;
  });
  return result;
}
