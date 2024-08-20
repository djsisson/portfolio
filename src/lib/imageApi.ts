"use server";

import * as fs from "fs";
import { join } from "path";

/**
 * @param route The route path, excluding base path, without leading or trailing slashes. E.g. test/page or page
 * @param includeSharedImages Whether the images in the base images folder should be included
 */

type imgMeta = {
  fileName: string;
  relativePath: string;
  width: number;
  height: number;
  imgBase64: string;
};

export async function getRouteImageMeta(
  route: string,
  includeSharedImages: boolean,
): Promise<{ [key: string]: imgMeta }> {
  const routeImgPath = join(
    process.cwd(),
    "public",
    "assets",
    route === "" ? "home" : route,
    "imgMeta.json",
  );

  const routeImgMeta = JSON.parse(fs.readFileSync(routeImgPath, "utf-8")) as {
    [key: string]: imgMeta;
  };

  if (includeSharedImages) {
    const sharedImgMeta = JSON.parse(
      fs.readFileSync(
        join(process.cwd(), "public", "assets", "imgMeta.json"),
        "utf-8",
      ),
    ) as { [key: string]: imgMeta };
    return { ...sharedImgMeta, ...routeImgMeta };
  }

  return routeImgMeta;
}
