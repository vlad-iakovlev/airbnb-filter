import chalk from "chalk";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

interface Icon {
  srcPath: string;
  dstPath: string;
  srcSize: number;
  dstSize: number;
  background: string;
}

const generateIcon = async (icon: Icon) => {
  const srcPath = path.join(process.cwd(), icon.srcPath);
  const dstPath = path.join(process.cwd(), "public", icon.dstPath);

  await fs.promises.mkdir(path.dirname(dstPath), { recursive: true });

  const srcIcon = await sharp(srcPath)
    .resize({
      width: icon.srcSize,
      height: icon.srcSize,
      fit: "contain",
    })
    .toBuffer();

  await sharp({
    create: {
      width: icon.dstSize,
      height: icon.dstSize,
      channels: 4,
      background: icon.background,
    },
  })
    .composite([{ input: srcIcon }])
    .png()
    .toFile(dstPath);

  console.log(
    chalk.green.bold(`[${icon.srcPath} => ${icon.dstPath}]`),
    "Generated",
  );
};

await generateIcon({
  srcPath: "icons/icon.svg",
  dstPath: "icons/icon16.png",
  srcSize: 16,
  dstSize: 16,
  background: "#00000000",
});

await generateIcon({
  srcPath: "icons/icon.svg",
  dstPath: "icons/icon32.png",
  srcSize: 32,
  dstSize: 32,
  background: "#00000000",
});

await generateIcon({
  srcPath: "icons/icon.svg",
  dstPath: "icons/icon48.png",
  srcSize: 48,
  dstSize: 48,
  background: "#00000000",
});

await generateIcon({
  srcPath: "icons/icon.svg",
  dstPath: "icons/icon128.png",
  srcSize: 128,
  dstSize: 128,
  background: "#00000000",
});
