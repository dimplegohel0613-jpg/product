const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const INPUT_DIR = "public/models";
const OUTPUT_DIR = "public/models";

const BG = { r: 248, g: 248, b: 248 };
const SOFT_TOLERANCE = 20;
const HARD_TOLERANCE = 35;

async function removeBackground(inputPath, outputPath) {
  const image = sharp(inputPath);
  const meta = await image.metadata();
  const { width, height } = meta;

  const buffer = await image.raw().toBuffer();
  const pixels = Buffer.alloc(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const srcIdx = i * 3;
    const dstIdx = i * 4;
    const r = buffer[srcIdx];
    const g = buffer[srcIdx + 1];
    const b = buffer[srcIdx + 2];

    const dr = Math.abs(r - BG.r);
    const dg = Math.abs(g - BG.g);
    const db = Math.abs(b - BG.b);
    const maxDist = Math.max(dr, dg, db);

    let alpha;
    if (maxDist < SOFT_TOLERANCE) {
      alpha = 0;
    } else if (maxDist < HARD_TOLERANCE) {
      const t = (maxDist - SOFT_TOLERANCE) / (HARD_TOLERANCE - SOFT_TOLERANCE);
      alpha = Math.round(t * 255);
    } else {
      alpha = 255;
    }

    pixels[dstIdx] = r;
    pixels[dstIdx + 1] = g;
    pixels[dstIdx + 2] = b;
    pixels[dstIdx + 3] = alpha;
  }

  await sharp(pixels, { raw: { width, height, channels: 4 } }).toFile(outputPath);
  console.log(`Done: ${path.basename(outputPath)} (${Math.round((1 - pixels.filter((_, j) => j % 4 === 3 && pixels[j] === 0).length / (width * height)) * 100)}% opaque)`);
}

async function main() {
  const files = fs.readdirSync(INPUT_DIR).filter((f) => f.endsWith(".jpeg"));
  for (const file of files) {
    const input = path.join(INPUT_DIR, file);
    const output = path.join(OUTPUT_DIR, file.replace(".jpeg", ".png"));
    await removeBackground(input, output);
  }
  console.log("All done");
}

main().catch(console.error);
