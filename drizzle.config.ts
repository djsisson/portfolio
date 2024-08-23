import { defineConfig } from "drizzle-kit";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd(), true);

export default defineConfig({
  schema: [
    "./src/db/asteroidz/schema.ts",
    "./src/db/genshin/schema.ts",
    "./src/db/todos/schema.ts",
    "./src/db/tilez/schema.ts",
  ],
  out: "./src/db/migrations",
  dialect: "postgresql",
  schemaFilter: "public",
  verbose: true,
  strict: true,
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
});
