import { faker } from "@faker-js/faker";
import { eq, inArray } from "drizzle-orm";
import * as forum from "../forum/schema";
import * as genshin from "../genshin/schema";
import type { Transaction } from "./seed";

const randomWords = () => {
	const words = [];
	for (let i = 0; i < Math.floor(Math.random() * 5) + 1; i++) {
		words.push(`#${faker.lorem.word()}`);
	}
	return [...new Set(words)];
};

const randomMessage = () => {
	return faker.lorem.sentences({ min: 1, max: 3 }, "\n");
};

const randomName = () => {
	const first_name = faker.person.firstName();
	const last_name = faker.person.lastName();
	const email = faker.internet.email({
		firstName: first_name,
		lastName: last_name,
	});
	const username = `${faker.word.adjective()}_${faker.word.noun()}`.replace(
		" ",
		"",
	);
	const bio = faker.person.bio();

	return {
		username: username.toLowerCase().replace("'", "''"),
		first_name: first_name.replace("'", "''"),
		last_name: last_name.replace("'", "''"),
		email: email.replace("'", "''"),
		bio: bio,
	};
};

const addUsers = async (client: Transaction) => {
	const icons = await client.select().from(genshin.characters);
	const users = [] as (typeof forum.users.$inferInsert)[];
	for (let i = 0; i < 100; i++) {
		users.push({
			...randomName(),
			avatar: icons[Math.floor(Math.random() * icons.length)].name,
		});
	}
	await client.insert(forum.users).values(users);
};

const generateMessage = async (client: Transaction, nummsg = 100) => {
	const icons = await client
		.select()
		.from(forum.users)
		.innerJoin(
			genshin.characters,
			eq(forum.users.avatar, genshin.characters.name),
		)
		.innerJoin(
			genshin.elements,
			eq(genshin.characters.element_id, genshin.elements.id),
		);

	const msgs = [];
	const allTags = [];
	for (let i = 0; i < nummsg; i++) {
		const userId = Math.floor(Math.random() * icons.length);
		const rndTags = [
			...randomWords(),
			`#${icons[userId].elements.name.toLowerCase()}`,
		];
		const msgToSend = {
			message: `${randomMessage()} ${rndTags.join(" ")}`,
			created:
				`${faker.date.recent({ days: 365 }).toISOString().slice(0, -5)}Z`,
			user_id: icons[userId].users.id,
		};
		msgs.push(msgToSend);
		allTags.push(rndTags);
	}

	return { msgs: msgs, allTags: allTags };
};

const addMessages = async (client: Transaction) => {
	const { msgs, allTags } = await generateMessage(client, 100);

	const msgIds = await client.insert(forum.messages).values(msgs).returning();

	const tagIds = await client
		.insert(forum.hashtags)
		.values([...new Set(allTags.flat())].map((x) => ({ hashtag: x })))
		.returning();

	const junction = msgIds.flatMap((x, i) =>
		allTags[i].map((y) => ({
			message_id: x.id,
			hashtag_id: tagIds.find((z) => z.hashtag === y)?.id || "",
		})),
	);

	await client.insert(forum.hashtag_messages).values(junction);
};

const addComments = async (client: Transaction) => {
	const { msgs, allTags } = await generateMessage(client, 200);

	const allMsgs = await client
		.select({ id: forum.messages.id })
		.from(forum.messages);

	const comments = msgs.map((x, i) => ({
		...x,
		parent_id: allMsgs[Math.floor(i / 2)].id,
	}));

	await client
		.insert(forum.hashtags)
		.values([...new Set(allTags.flat())].map((x) => ({ hashtag: x })))
		.onConflictDoNothing();

	const tagIds = await client
		.select()
		.from(forum.hashtags)
		.where(inArray(forum.hashtags.hashtag, allTags.flat()));

	const msgIds = await client
		.insert(forum.messages)
		.values(comments)
		.returning();

	const junction = msgIds.flatMap((x, i) =>
		allTags[i].map((y) => ({
			message_id: x.id,
			hashtag_id: tagIds.find((z) => z.hashtag === y)?.id || "",
		})),
	);

	await client.insert(forum.hashtag_messages).values(junction);
};

export const forumSeed = async (db: Transaction) => {
	await addUsers(db);
	await addMessages(db);
	await addComments(db);
};
