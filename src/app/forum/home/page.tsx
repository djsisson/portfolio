import { desc, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { dbClient } from "@/db/forum/db";
import { messages } from "@/db/forum/schema";
import { getUser } from "@/lib/auth-client";
import { upsertTags } from "../lib/helper_functions";

export default async function Home({
	_searchParams,
}: {
	_searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const userId = await getUser();

	async function _NewPostFunction(formData: FormData) {
		"use server";
		try {
			const msg = formData.get("message") as string;
			const msgId = await dbClient()
				.db.insert(messages)
				.values({
					message: msg,
					user_id: userId?.sub as string,
				})
				.returning({ id: messages.id });
			await upsertTags(msgId[0]?.id, msg, false);
			revalidatePath("/forum/home");
		} catch (error) {
			console.log(error);
		}
	}

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
