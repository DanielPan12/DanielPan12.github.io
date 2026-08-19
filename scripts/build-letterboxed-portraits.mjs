import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_ROOT = path.resolve(__dirname, '../public/assets/images');

// Portrait photos used on the Campus (学生工作) page's Accordion Gallery.
// Cropping these into the gallery's wide landscape panels loses most of the
// photo; showing them uncropped with a blurred fill in the side gaps
// (composited live in the browser, matching the same treatment here) used
// to be done at runtime, but even with the orientation known ahead of time,
// switching to one still visibly stutters — GSAP's panel-resize timeline
// and the CSS filter:blur repaint compete for the same frame. Baking the
// same composite once, offline, into a flat landscape JPEG removes that
// entirely: the browser then just displays a normal photo like any other.
const TARGET_W = 1920;
const TARGET_H = 1080;
const BLUR_SIGMA = 22;
const BG_BRIGHTNESS = 0.62;
const BG_SATURATION = 1.1;

const files = [
  'campus-life/water-polo-captain/季军奖杯.jpg',
  'campus-life/ciie-volunteer/IMG_2109.JPEG',
  'campus-life/ciie-volunteer/6961ae4b-e20e-4253-8f04-0435c0eedae1.png',
  'campus-life/student-union-quality-dept/歌手大赛工作人员工牌.JPEG'
];

async function buildOne(rel) {
  const inputPath = path.join(IMAGES_ROOT, rel);
  const parsed = path.parse(rel);
  const outPath = path.join(IMAGES_ROOT, parsed.dir, `${parsed.name}-display.jpg`);

  const background = await sharp(inputPath)
    .rotate()
    .resize(TARGET_W, TARGET_H, { fit: 'cover' })
    .blur(BLUR_SIGMA)
    .modulate({ brightness: BG_BRIGHTNESS, saturation: BG_SATURATION })
    .toBuffer();

  const foreground = await sharp(inputPath)
    .rotate()
    .resize(TARGET_W, TARGET_H, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp(background)
    .composite([{ input: foreground, left: 0, top: 0 }])
    .jpeg({ quality: 92 })
    .toFile(outPath);

  console.log(`Built: ${outPath}`);
}

async function build() {
  for (const rel of files) {
    await buildOne(rel);
  }
}

build().catch(err => {
  console.error(err);
  process.exit(1);
});
