import fs from "fs";
import path from "path";
import sharp from "sharp";

type imgMeta = {
  fileName: string;
  relativePath: string;
  width: number;
  height: number;
  imgBase64: string;
};

async function processImage(imagePath: string) {
  const sharpImg = sharp(imagePath);
  const meta = await sharpImg.metadata();
  if (!meta) {
    return null;
  }
  const placeholderImgWidth = 20;
  const imgAspectRatio = meta.width! / meta.height!;
  const placeholderImgHeight = Math.round(placeholderImgWidth / imgAspectRatio);
  const imgBase64 = await sharpImg
    .resize(placeholderImgWidth, placeholderImgHeight)
    .toBuffer()
    .then(
      (buffer) =>
        `data:image/${meta.format};base64,${buffer.toString("base64")}`,
    );

  return {
    fileName: path.basename(imagePath),
    // Strip public prefix, /public is / in Nextjs runtime environment
    relativePath: path
      .relative(process.cwd(), imagePath)
      .substring("public".length),
    width: meta.width!,
    height: meta.height!,
    imgBase64,
  };
}
async function processImages(folderName: string, recursive: boolean) {
  const imageFolder = fs.readdirSync(folderName);

  const recurseFolders = [];
  const folderImgMeta = {} as { [key: string]: imgMeta };

  for await (const item of imageFolder) {
    const itemIsDir = fs.lstatSync(path.join(folderName, item)).isDirectory();
    if (itemIsDir) {
      recurseFolders.push(path.join(folderName, item));
    } else if (path.extname(item) !== ".json") {
      const imgMeta = await processImage(path.join(folderName, item));
      folderImgMeta[imgMeta!.fileName] = imgMeta!;
    }
  }

  fs.writeFileSync(
    path.join(folderName, "imgMeta.json"),
    JSON.stringify(folderImgMeta),
  );

  if (Object.keys(folderImgMeta).length !== 0) {
    const constantsFilePath = path.join(
      process.cwd(),
      "/src",
      "lib",
      "imgMeta.ts",
    );

    const constName = folderName.split("/").slice(-1)[0];
    const fileContent = `export const ${constName} = ${JSON.stringify(folderImgMeta)};`;
    fs.appendFileSync(constantsFilePath, fileContent);
  }

  if (recursive)
    recurseFolders.forEach(async (folder) => await processImages(folder, true));

  return;
}

async function processAllImages() {
  const imgMetaFilePath = path.join(process.cwd(), "/src", "lib", "imgMeta.ts");
  if (fs.existsSync(imgMetaFilePath)) {
    fs.rmSync(imgMetaFilePath);
  }
  await processImages(path.join(process.cwd(), "/public", "assets"), true);
}

processAllImages();
