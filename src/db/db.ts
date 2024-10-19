import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as genshin_schema from "./genshin/schema";
import * as genshin_relations from "./genshin/relations";
import * as asteroidz_schema from "./asteroidz/schema";
import * as asteroidz_relations from "./asteroidz/relations";
import * as forum_schema from "./forum/schema";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd(), true);
// import * as forum_relations from "./forum/relations";

const connectionString = process.env.DATABASE_STUDIO_URL;
const client = postgres(connectionString as string, {
  prepare: false,
  connect_timeout: 60,
  idle_timeout: 10,
});

export const db = drizzle(client, {
  schema: {
    ...genshin_schema,
    ...genshin_relations,
    ...asteroidz_schema,
    ...asteroidz_relations,
    ...forum_schema,
  },
  logger: true,
});
