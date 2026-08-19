import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_ROOT = path.resolve(__dirname, '../public/assets/images');

// Certificates / badges / credit-screen images excluded on purpose — they
// read as flat text documents rather than photos, and don't belong in a
// photo-wall background.
const files = [
  'campus-life/ciie-volunteer/IMG_2416.JPEG',
  'campus-life/student-union-art-dept/9c2d42313cc92a47597994a5b3145234.jpg',
  'campus-life/student-union-art-dept/IMG_2933.JPEG',
  'campus-life/student-union-quality-dept/校庆项目组合照.JPEG',
  'campus-life/student-union-quality-dept/歌手大赛项目组合照.JPEG',
  'campus-life/water-polo-captain/5ec0045077b93a9df2ad4675a9f120a3.jpg',
  'campus-life/water-polo-captain/9104d7bbaca859a8a8d7cd93c289b52c.jpg',
  'campus-life/water-polo-captain/季军奖杯.jpg',
  'campus-life/water-polo-captain/球队年会.JPEG',
  'campus-life/water-polo-captain/训练合照.jpg',
  'hobbies/basketball/剑桥篮球.jpg',
  'hobbies/basketball/同济大学机械学院篮球队.JPEG',
  'hobbies/basketball/大一同德学堂队.JPEG',
  'hobbies/basketball/投篮特写.JPEG',
  'hobbies/gaming/博德之门.JPEG',
  'hobbies/gaming/天国拯救.jpg',
  'hobbies/gaming/宝可梦.JPEG',
  'hobbies/gaming/艾尔登法环1.JPEG',
  'hobbies/gaming/艾尔登法环2.JPEG',
  'hobbies/other-sports/健身.jpg',
  'hobbies/other-sports/匹克球.jpg',
  'hobbies/other-sports/滑雪.JPEG',
  'hobbies/other-sports/网球.jpg',
  'hobbies/other-sports/马球.jpg',
  'hobbies/other-sports/龙舟.JPEG',
  'hobbies/rowing/9fafea29ee43839a20bff2cd2985dac7.jpg',
  'hobbies/rowing/c1c9727dd80dfeddac3d46267f20dd75.jpg',
  'hobbies/singing/剑桥大学歌手大赛.jpg',
  'hobbies/singing/剑桥春晚.jpg',
  'hobbies/singing/同济大学合唱团男低声部合照.JPEG',
  'hobbies/singing/嘉定之星决赛.JPEG',
  'hobbies/singing/嘉定之星复赛.JPEG',
  'hobbies/singing/毕业晚会唱歌.JPEG',
  'hobbies/singing/民族嘉年华.JPEG',
  'hobbies/social-media/小红书.jpg',
  'hobbies/social-media/抖音.jpg',
  'hobbies/stand-up-comedy/同济脱口秀.JPEG',
  'hobbies/stand-up-comedy/旦口戏剧录节目.jpg',
  'hobbies/travel/6cdd6d3ac2923e1a8df75498bdd6b14f.jpg',
  'hobbies/travel/6d4dd50fd87fb12d17feb6f6e0eb0ad5.jpg',
  'hobbies/travel/78c1a9faf2bf30006f9b6ffdb6ce0e88.jpg',
  'hobbies/travel/93a5de05824a52a185a51e61a54ec001.jpg',
  'hobbies/travel/IMG_0659.JPEG',
  'hobbies/travel/IMG_4676.JPEG',
  'hobbies/travel/IMG_8103.JPEG',
  'hobbies/travel/IMG_9603.JPEG',
  'hobbies/travel/aa55ca25f9a6cbdc48840678e3c74be8.jpg',
  'hobbies/travel/af034f4b7ade215d3224dd62b43e941f.jpg',
  'hobbies/travel/b0902462430bef8a01f7abbb462f8fab.jpg',
  'hobbies/travel/c71f50b0b2c7b656faa447aa2d5dd25b.jpg',
  'hobbies/travel/e08f98de8d3f912c3bb4c3c65fcee7a6.jpg',
  'hobbies/travel/e5817b10ed173e6c400de2e243922fd0.jpg',
  'hobbies/travel/fb11bd11f1961ce308abf7f42a2b7a18.jpg',
  'hobbies/water-polo/0ec5a09a54b2b2094a0ea9360d926761.jpg',
  'hobbies/water-polo/6d3d839dfdab194f227080ffe9893de3.jpg',
  'hobbies/water-polo/c6c9a542be8e37f80589f8206df60cc6.jpg',
  'hobbies/water-polo/水球训练照.JPEG'
];

const isTravel = rel => rel.startsWith('hobbies/travel/');

// Deterministic PRNG (no external dep) so re-running the script gives a
// stable, reproducible layout.
function makeRng(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function seededShuffle(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Grid unit = the smallest tile (the "1.5x1.5" square). Shapes are all
// expressed as multiples of it: 1x1 small square, 2x1 / 1x2 wide/tall
// rectangle ("3x1.5" / "1.5x3"), 2x2 big square ("3x3").
async function getOrientation(rel) {
  const meta = await sharp(path.join(IMAGES_ROOT, rel)).metadata();
  const rotated = meta.orientation >= 5 && meta.orientation <= 8;
  const w = rotated ? meta.height : meta.width;
  const h = rotated ? meta.width : meta.height;
  const ratio = w / h;
  if (ratio > 1.15) return 'landscape';
  if (ratio < 1 / 1.15) return 'portrait';
  return 'square';
}

// Never crop a photo into a tile whose rectangle runs the opposite way to
// how the photo was actually shot — landscape photos only ever get a
// landscape rectangle (or a square), portrait photos only ever get a
// portrait rectangle (or a square). Square-ish source photos can take
// either rectangle since neither crop fights the original composition.
function sizeFor(rel, orientation, rng) {
  const boosted = isTravel(rel);

  if (orientation === 'landscape') {
    const weights = boosted ? [0.2, 0.3, 0.5] : [0.55, 0.3, 0.15];
    return pick([[1, 1], [2, 1], [2, 2]], weights, rng);
  }
  if (orientation === 'portrait') {
    const weights = boosted ? [0.2, 0.3, 0.5] : [0.55, 0.3, 0.15];
    return pick([[1, 1], [1, 2], [2, 2]], weights, rng);
  }
  const weights = boosted ? [0.15, 0.2, 0.2, 0.45] : [0.55, 0.15, 0.15, 0.15];
  return pick([[1, 1], [2, 1], [1, 2], [2, 2]], weights, rng);
}

function pick(options, weights, rng) {
  const r = rng();
  let acc = 0;
  for (let i = 0; i < options.length; i++) {
    acc += weights[i];
    if (r <= acc) return options[i];
  }
  return options[0];
}

const UNIT = 210;
const COLS = 13;

async function build() {
  const orientations = {};
  await Promise.all(
    files.map(async rel => {
      orientations[rel] = await getOrientation(rel);
    })
  );

  const rng = makeRng(2026);
  const shuffled = seededShuffle(files, rng);

  // Skyline bin-packing: for each image, find the column span with the
  // lowest current height, place it there, then raise that span's height.
  const heightMap = new Array(COLS).fill(0);
  const placements = [];

  for (const rel of shuffled) {
    const [w, h] = sizeFor(rel, orientations[rel], rng);
    const span = Math.min(w, COLS);
    let bestX = 0;
    let bestY = Infinity;
    for (let x = 0; x <= COLS - span; x++) {
      let maxH = 0;
      for (let i = x; i < x + span; i++) maxH = Math.max(maxH, heightMap[i]);
      if (maxH < bestY) {
        bestY = maxH;
        bestX = x;
      }
    }
    placements.push({ rel, x: bestX, y: bestY, w: span, h });
    for (let i = bestX; i < bestX + span; i++) heightMap[i] = bestY + h;
  }

  const totalRows = Math.max(...heightMap);

  // Fill any leftover empty cells (skyline packing isn't perfectly dense)
  // with small repeats, respecting the same orientation rule, so the final
  // canvas has no gaps.
  const occ = Array.from({ length: totalRows }, () => new Array(COLS).fill(false));
  for (const p of placements) {
    for (let yy = p.y; yy < p.y + p.h; yy++) {
      for (let xx = p.x; xx < p.x + p.w; xx++) {
        occ[yy][xx] = true;
      }
    }
  }
  let fillIdx = 0;
  for (let yy = 0; yy < totalRows; yy++) {
    for (let xx = 0; xx < COLS; xx++) {
      if (!occ[yy][xx]) {
        placements.push({ rel: shuffled[fillIdx % shuffled.length], x: xx, y: yy, w: 1, h: 1 });
        fillIdx += 1;
      }
    }
  }

  const tiles = await Promise.all(
    placements.map(async p => {
      const buf = await sharp(path.join(IMAGES_ROOT, p.rel))
        .rotate()
        .resize(p.w * UNIT, p.h * UNIT, { fit: 'cover' })
        .toBuffer();
      return { input: buf, left: p.x * UNIT, top: p.y * UNIT };
    })
  );

  const outPath = path.join(IMAGES_ROOT, 'mosaic.jpg');

  await sharp({
    create: {
      width: COLS * UNIT,
      height: totalRows * UNIT,
      channels: 3,
      background: { r: 10, g: 14, b: 22 }
    }
  })
    .composite(tiles)
    .jpeg({ quality: 90 })
    .toFile(outPath);

  console.log(
    `Built mosaic: ${outPath} (${COLS * UNIT}x${totalRows * UNIT}, ${placements.length} tiles, ${shuffled.length} unique photos)`
  );
}

build().catch(err => {
  console.error(err);
  process.exit(1);
});
