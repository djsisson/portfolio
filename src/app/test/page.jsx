import { db } from "@/db/db";
import { sql } from "drizzle-orm";

const dynamic = "force-dynamic";

export default async function Page() {
  const test = await db.execute(sql`SELECT now()`);

  console.log(test);
  return (
    <div>
      <h1>{test[0].now || "Hello World"}</h1>
    </div>
  );
}
