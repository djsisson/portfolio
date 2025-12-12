import { eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { dbClient } from "@/db/forum/db";
import { hashtag_messages, hashtags } from "@/db/forum/schema";

export const upsertTags = async (
	msgid: string,
	msg: string,
	editmsg: boolean = false,
) => {
	const tags = msg.toLowerCase().match(/#[\p{L}0-9-_]+/giu);

	if (!tags || tags.length === 0) return;
	tags.forEach((x) => revalidatePath(`forum/posts/tags/${x.slice(1)}`));

	if (editmsg) {
		await dbClient()
			.db.delete(hashtag_messages)
			.where(eq(hashtag_messages.message_id, msgid));
	}

	await dbClient()
		.db.insert(hashtags)
		.values(tags.map((x) => ({ hashtag: x })))
		.onConflictDoNothing();

	await dbClient()
		.db.insert(hashtag_messages)
		.select(
			dbClient()
				.db.select({
					hashtag_id: hashtags.id,
					message_id: sql`${msgid}`.as("message_id"),
				})
				.from(hashtags)
				.where(inArray(hashtags.hashtag, tags)),
		);
};
