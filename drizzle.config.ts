import { defineConfig } from "drizzle-kit";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd(), true);

const base = "./src/db/";

export default defineConfig({
  schema: [
    `${base}asteroidz/schema.ts`,
    `${base}genshin/schema.ts`,
    `${base}todos/schema.ts`,
    `${base}tilez/schema.ts`,
    `${base}forum/schema.ts`,
  ],
  out:  `${base}migrations`,
  dialect: "postgresql",
  schemaFilter: "public",
  casing: "snake_case",
  migrations: {
    prefix: "timestamp"
  },
  entities:{
    roles: {
      provider: "supabase",
      exclude: ["supabase_Auth_admin"]
    }
  },
  verbose: true,
  strict: true,
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
});
