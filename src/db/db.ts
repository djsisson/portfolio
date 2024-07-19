import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as relations from "./relations";

const connectionString = process.env.DATABASE_URL;

const client = postgres(connectionString as string);

export const db = drizzle(client, {
  schema: { ...schema, ...relations },
  logger: true,
});
