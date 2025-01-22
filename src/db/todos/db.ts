import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { sql } from "drizzle-orm";
import { JWTPayload } from "jose";

type SupabaseToken = {
  role?: string;
} & JWTPayload;

const connectionString = process.env.DATABASE_AUTH_URL!;
const db = drizzle({
  client: postgres(connectionString, {
    prepare: false,
    connect_timeout: 60,
    idle_timeout: 10,
  }),
  schema,
});
export function dbClient<Token extends SupabaseToken = SupabaseToken>(
  token: Token,
) {
  return {
    db,
    rls: (async (transaction, ...rest) => {
      return await db.transaction(
        async (tx) => {
          try {
            await tx.execute(sql`
            -- auth.jwt()
            select set_config('request.jwt.claims', '${sql.raw(
              JSON.stringify(token),
            )}', TRUE);
            -- auth.uid()
            select set_config('request.jwt.claim.sub', '${sql.raw(
              token.sub ?? "",
            )}', TRUE);												
            -- set local role
            set local role ${sql.raw(token.aud?.toString() ?? "anon")};
            `);
            return await transaction(tx);
          } finally {
            await tx.execute(sql`
            -- reset
            select set_config('request.jwt.claims', NULL, TRUE);
            select set_config('request.jwt.claim.sub', NULL, TRUE);
            reset role;
            `);
          }
        },
        ...rest,
      );
    }) as typeof db.transaction,
  };
}
