import "server-only";
import { db } from "@/db/db";

export type Cities = Awaited<ReturnType<typeof genshin_data>>;
export type Characters = Awaited<ReturnType<typeof genshin_data>>[0]["characters"];

export const genshin_data = async () => {
  const data = await db.query.cities.findMany({
    with: {
      characters: {
        with: {
          element: true,
        },
        orderBy: (characters, { asc }) => [asc(characters.name)],
      },
    },
  });
  return data;
};
