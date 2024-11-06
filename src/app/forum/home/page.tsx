import { dbClient } from "@/db/forum/db";
import { messages } from "@/db/forum/schema";
import { desc, isNull } from "drizzle-orm";

export default async function Home() {
  const posts = await dbClient()
    .db.select()
    .from(messages)
    .where(isNull(messages.parent_id))
    .orderBy(desc(messages.createdAt));
  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          {post.message}
          <div>
            <br />
          </div>
        </div>
      ))}
    </div>
  );
}
