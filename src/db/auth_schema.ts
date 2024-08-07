import { pgSchema, uuid } from "drizzle-orm/pg-core";

const mySchema = pgSchema("auth");

export const users = mySchema.table("users", {
  id: uuid("id").primaryKey(),
});
