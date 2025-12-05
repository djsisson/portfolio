import { Suspense } from "react";
import Character from "./components/Character";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { genshinData as data } from "./data";

export default async function Genshin() {
	return (
		<div className="relative flex h-svh w-svw flex-col">
			<Header />
			<Suspense fallback="loading">
				<Character data={data} />
			</Suspense>
			<Footer />
		</div>
	);
}
