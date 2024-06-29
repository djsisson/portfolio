import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./migrations/schema";
import * as relations from "./migrations/relations";

const connectionString = process.env.DATABASE_URL;
console.log(connectionString);
const client = postgres(connectionString as string);

export const db = drizzle(client, {
  schema: { ...schema, ...relations },
  logger: true,
});
