import Auth from "@/components/auth";
import { getUser } from "@/lib/auth-client";
import GameScore from "./GameScore";
export default async function Header() {
	const user: {
		user_metadata?: { avatar_url: string; name: string } | undefined;
	} | null = (await getUser()) as {
		user_metadata?: { avatar_url: string; name: string } | undefined;
	} | null;

	return (
		<div className="bg-secondary flex w-full items-center justify-between gap-4 py-2 px-4">
			<div className="text-center font-bold">Tilez</div>
			{user && <GameScore />}
			<Auth app={"/tilez"} />
		</div>
	);
}
