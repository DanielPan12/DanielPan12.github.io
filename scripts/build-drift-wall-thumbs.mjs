import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_ROOT = path.resolve(__dirname, '../public/assets/images');
const SRC_DIR = path.join(IMAGES_ROOT, 'hobbies');
const OUT_DIR = path.join(IMAGES_ROOT, 'hobbies-thumb');

// DriftWall renders every source photo as ~40 duplicated tiles (columns
// looping through copies) at ~225x168 CSS px, so the original camera-res
// files (several 5-15MB JPEGs) were forcing the browser to fetch+decode
// hundreds of megapixels of image data just to paint a tiny tile.
const MAX_DIMENSION = 640;
const QUALITY = 78;

async function walk(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (/\.(jpe?g|png)$/i.test(entry.name)) files.push(full);
  }
  return files;
}

async function build() {
  const files = await walk(SRC_DIR);

  await Promise.all(
    files.map(async src => {
      const rel = path.relative(SRC_DIR, src);
      const out = path.join(OUT_DIR, rel);
      await fs.promises.mkdir(path.dirname(out), { recursive: true });
      await sharp(src)
        .rotate()
        .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: QUALITY })
        .toFile(out);
    })
  );

  console.log(`Built ${files.length} DriftWall thumbnails in ${OUT_DIR}`);
}

build().catch(err => {
  console.error(err);
  process.exit(1);
});
