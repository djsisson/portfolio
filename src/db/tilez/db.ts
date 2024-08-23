import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { JWTPayload } from "jose";
import { sql } from "drizzle-orm";

const connectionString = process.env.DATABASE_AUTH_URL!;
const client = postgres(connectionString, {
  prepare: false,
  connect_timeout: 60,
  idle_timeout: 10,
});
const db = drizzle(client, { schema });
export const getdb = (decodedJwt?: JWTPayload) => {
  return new Proxy<typeof db>(db, {
    get(target, prop) {
      if (prop === "transaction" && decodedJwt) {
        return (async (transaction, ...rest) => {
          return await target.transaction(
            async (tx) => {
              await tx.execute(sql`
                          select set_config('request.jwt.claims', '${sql.raw(
                            JSON.stringify(decodedJwt),
                          )}', TRUE);
                          select set_config('request.jwt.claim.sub', '${sql.raw(
                            decodedJwt.sub ?? "",
                          )}', TRUE);
                          select set_config('request.jwt.claim.email', '${sql.raw(
                            decodedJwt.email as string,
                          )}', TRUE);
                          select set_config('request.jwt.claim.role', '${sql.raw(
                            decodedJwt.role as string,
                          )}', TRUE);
                          set local role ${sql.raw(decodedJwt.role as string)};
                      `);
              return await transaction(tx);
            },
            ...rest,
          );
        }) as typeof db.transaction;
      } else return target[prop as keyof typeof db];
    },
  });
};
