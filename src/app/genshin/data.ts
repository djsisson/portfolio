import * as genshin from "@/db/genshin/data";

export type Cities = typeof genshinData;
export type Characters = (typeof genshinData)[0]["characters"];

export const genshinData = genshin.cities.map((city) => {
  return {
    ...city,
    characters: genshin.characters
      .filter((char) => char.city_name === city.name)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((char) => {
        return {
          ...char,
          element: genshin.elements.find(
            (el) => el.name === char.element_name,
          ) || genshin.elements[0],
        };
      }),
  };
});
