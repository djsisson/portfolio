import "server-only";
import { db } from "@/db/db";

export const genshin_data = async () => {
  const data = await db.query.cities.findMany({
    with: {
      characters: {
        with: {
          element: true,
        },
      },
    },
  });
  return data;
};
