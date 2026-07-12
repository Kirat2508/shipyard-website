/**
 * Resize + WebP encode for fellows, gallery, mentors, and hero.
 * Outputs {name}-{width}.webp and src/data/imageManifest.json (blur placeholders).
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const manifestPath = path.join(root, "src/data/imageManifest.json");

const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;
const SKIP_OPT = /-(?:\d+|placeholder)\.webp$/i;

const JOBS = [
  {
    id: "fellows",
    dir: "public/images/fellows",
    widths: [400, 800],
    quality: 85,
    fit: "cover",
  },
  {
    id: "gallery",
    dir: "public/images/gallery",
    widths: [300, 600],
    quality: 82,
    fit: "cover",
    square: true,
  },
  {
    id: "mentors",
    dir: "public/images/mentors",
    widths: [300, 600],
    quality: 85,
    fit: "cover",
  },
];

const HERO_FILES = [
  {
    input: "public/images/hero-image/shipyard-builder-photoroom.png",
    widths: [640, 1280],
    quality: 85,
  },
];

async function listSourceImages(dirRel) {
  const dir = path.join(root, dirRel);
  const entries = await fs.readdir(dir);
  return entries
    .filter((name) => IMAGE_EXT.test(name) && !SKIP_OPT.test(name))
    .map((name) => path.join(dir, name));
}

function publicUrl(absPath) {
  const rel = path.relative(path.join(root, "public"), absPath).split(path.sep).join("/");
  return `/${rel}`;
}

function baseName(filePath) {
  return path.basename(filePath, path.extname(filePath));
}

/** Lowercase slug so Sashank.jpg / sashank.png don't collide on case-insensitive disks. */
function outputSlug(filePath) {
  return baseName(filePath).toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

async function writeVariant(pipeline, outPath, width, quality) {
  await pipeline
    .clone()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 4 })
    .toFile(outPath);
}

async function processFile(filePath, job) {
  const slug = outputSlug(filePath);
  const outDir = path.dirname(filePath);
  const meta = await sharp(filePath).metadata();
  const manifestKey = publicUrl(filePath);

  const variants = {};
  let pipeline = sharp(filePath).rotate();

  if (job.square) {
    const side = Math.min(meta.width ?? 0, meta.height ?? 0);
    pipeline = pipeline.resize(side, side, { fit: "cover", position: "centre" });
  }

  for (const width of job.widths) {
    const outName = `${slug}-${width}.webp`;
    const outPath = path.join(outDir, outName);
    await writeVariant(pipeline, outPath, width, job.quality);
    variants[width] = publicUrl(outPath);
  }

  const placeholderPath = path.join(outDir, `${slug}-placeholder.webp`);
  await pipeline
    .clone()
    .resize(20, job.square ? 20 : undefined, {
      fit: job.square ? "cover" : "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 40 })
    .toFile(placeholderPath);

  const placeholderBuf = await fs.readFile(placeholderPath);
  const placeholder = `data:image/webp;base64,${placeholderBuf.toString("base64")}`;

  const widthList = job.widths;
  const src = variants[Math.max(...widthList)];
  const srcSet = widthList.map((w) => `${variants[w]} ${w}w`).join(", ");

  return {
    key: manifestKey,
    entry: { src, srcSet, placeholder, widths: widthList },
  };
}

async function processHero(file) {
  const abs = path.join(root, file.input);
  const outDir = path.dirname(abs);
  const slug = outputSlug(abs);
  const manifestKey = publicUrl(abs);
  const variants = {};
  const pipeline = sharp(abs).rotate();

  for (const width of file.widths) {
    const outPath = path.join(outDir, `${slug}-${width}.webp`);
    await writeVariant(pipeline, outPath, width, file.quality);
    variants[width] = publicUrl(outPath);
  }

  const placeholderPath = path.join(outDir, `${slug}-placeholder.webp`);
  await pipeline
    .clone()
    .resize(20, undefined, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 40 })
    .toFile(placeholderPath);

  const placeholderBuf = await fs.readFile(placeholderPath);
  const placeholder = `data:image/webp;base64,${placeholderBuf.toString("base64")}`;

  const srcSet = file.widths.map((w) => `${variants[w]} ${w}w`).join(", ");

  return {
    key: manifestKey,
    entry: {
      src: variants[Math.max(...file.widths)],
      srcSet,
      placeholder,
      widths: file.widths,
    },
  };
}

async function main() {
  const manifest = {};

  for (const job of JOBS) {
    const files = await listSourceImages(job.dir);
    console.log(`[${job.id}] ${files.length} sources`);
    for (const file of files) {
      const { key, entry } = await processFile(file, job);
      manifest[key] = entry;
      console.log(`  ok ${path.basename(file)}`);
    }
  }

  for (const hero of HERO_FILES) {
    const { key, entry } = await processHero(hero);
    manifest[key] = entry;
    console.log(`[hero] ok ${hero.input}`);
  }

  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`\nWrote ${Object.keys(manifest).length} entries → ${manifestPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
