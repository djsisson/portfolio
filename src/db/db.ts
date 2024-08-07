import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as genshin_schema from "./genshin/schema";
import * as genshin_relations from "./genshin/relations";
import * as asteroidz_schema from "./asteroidz/schema";
import * as asteroidz_relations from "./asteroidz/relations";

const connectionString = process.env.DATABASE_URL;

const client = postgres(connectionString as string);

export const db = drizzle(client, {
  schema: {
    ...genshin_schema,
    ...genshin_relations,
    ...asteroidz_schema,
    ...asteroidz_relations,
  },
  logger: true,
});
