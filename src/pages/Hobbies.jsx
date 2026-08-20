import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import DriftWall from '../components/reactbits/DriftWall';
import PhotoCarousel from '../components/PhotoCarousel';
import PageTransition from '../components/PageTransition';
import './Hobbies.css';

const photo = (folder, file, title) => ({ image: `assets/images/hobbies/${folder}/${file}`, title });

const RAW_ITEMS = [
  photo('basketball', '剑桥篮球.jpg', '篮球'),
  photo('basketball', '同济大学机械学院篮球队.JPEG', '篮球'),
  photo('basketball', '大一同德学堂队.JPEG', '篮球'),
  photo('basketball', '投篮特写.JPEG', '篮球'),
  photo('gaming', '博德之门.JPEG', '游戏'),
  photo('gaming', '天国拯救.jpg', '游戏'),
  photo('gaming', '宝可梦.JPEG', '游戏'),
  photo('gaming', '艾尔登法环1.JPEG', '游戏'),
  photo('gaming', '艾尔登法环2.JPEG', '游戏'),
  photo('other-sports', '健身.jpg', '健身'),
  photo('other-sports', '匹克球.jpg', '匹克球'),
  photo('other-sports', '滑雪.JPEG', '滑雪'),
  photo('other-sports', '网球.jpg', '网球'),
  photo('other-sports', '马球.jpg', '马球'),
  photo('other-sports', '龙舟.JPEG', '龙舟'),
  photo('rowing', '9fafea29ee43839a20bff2cd2985dac7.jpg', '赛艇'),
  photo('rowing', 'c1c9727dd80dfeddac3d46267f20dd75.jpg', '赛艇'),
  photo('singing', '剑桥大学歌手大赛.jpg', '唱歌'),
  photo('singing', '剑桥春晚.jpg', '唱歌'),
  photo('singing', '同济大学合唱团男低声部合照.JPEG', '唱歌'),
  photo('singing', '嘉定之星决赛.JPEG', '唱歌'),
  photo('singing', '嘉定之星复赛.JPEG', '唱歌'),
  photo('singing', '毕业晚会唱歌.JPEG', '唱歌'),
  photo('singing', '民族嘉年华.JPEG', '唱歌'),
  photo('social-media', '小红书.jpg', '自媒体'),
  photo('social-media', '抖音.jpg', '自媒体'),
  photo('stand-up-comedy', '同济脱口秀.JPEG', '脱口秀'),
  photo('stand-up-comedy', '旦口戏剧录节目.jpg', '脱口秀'),
  photo('travel', '6cdd6d3ac2923e1a8df75498bdd6b14f.jpg', '旅行'),
  photo('travel', 'IMG_0659.JPEG', '旅行'),
  photo('travel', '6d4dd50fd87fb12d17feb6f6e0eb0ad5.jpg', '旅行'),
  photo('travel', '78c1a9faf2bf30006f9b6ffdb6ce0e88.jpg', '旅行'),
  photo('travel', 'IMG_4676.JPEG', '旅行'),
  photo('travel', 'IMG_9603.JPEG', '旅行'),
  photo('travel', 'aa55ca25f9a6cbdc48840678e3c74be8.jpg', '旅行'),
  photo('travel', 'c71f50b0b2c7b656faa447aa2d5dd25b.jpg', '旅行'),
  photo('water-polo', '0ec5a09a54b2b2094a0ea9360d926761.jpg', '水球'),
  photo('water-polo', '6d3d839dfdab194f227080ffe9893de3.jpg', '水球'),
  photo('water-polo', 'c6c9a542be8e37f80589f8206df60cc6.jpg', '水球'),
  photo('water-polo', '水球训练照.JPEG', '水球')
];

// Deterministic shuffle (no external dep) so same-category photos — which
// arrive grouped in RAW_ITEMS — don't cluster into the same handful of
// columns; keeps the drift wall reading as a genuine mixed collage.
function seededShuffle(arr, seed) {
  let s = seed;
  const rng = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ITEMS = seededShuffle(RAW_ITEMS, 2026);

// All photos in a category, in the order they were authored above (not the
// shuffled wall order) — this is what the expanded card shows in full,
// uncropped size, regardless of which specific tile instance was clicked.
const PHOTOS_BY_CATEGORY = RAW_ITEMS.reduce((acc, item) => {
  (acc[item.title] ??= []).push(item.image);
  return acc;
}, {});

const FLYOUT_SPRING = { type: 'spring', stiffness: 300, damping: 30, mass: 0.9 };

const Hobbies = () => {
  const [expanded, setExpanded] = useState(null);

  const openCategory = (item, id, originRect) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const photos = PHOTOS_BY_CATEGORY[item.title] ?? [];
    const clickedIndex = Math.max(0, photos.indexOf(item.image));
    setExpanded({
      title: item.title,
      initialIndex: clickedIndex,
      origin: { top: originRect.top, left: originRect.left, width: originRect.width, height: originRect.height },
      target: { top: vh * 0.08, left: vw * 0.1, width: vw * 0.8, height: vh * 0.84 }
    });
  };

  const close = () => setExpanded(null);

  useEffect(() => {
    if (!expanded) return undefined;
    const onKeyDown = e => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [expanded]);

  return (
    <PageTransition>
      <section className="hobbies">
        <div className="hobbies__content">
          <div className="hobbies__wall">
            <DriftWall
              items={ITEMS}
              columns={7}
              tileWidth={225}
              tileHeight={168}
              gap={18}
              radius={18}
              tilt={7}
              turn={-5}
              depth={45}
              speed={30}
              variance={0.4}
              dim={0.95}
              overlayColor="#050a14"
              onTileClick={openCategory}
            />
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <>
              <motion.div
                className="hobbies__backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={close}
              />
              <motion.div
                className="hobbies__flyout"
                initial={{ ...expanded.origin, borderRadius: 18, opacity: 0.6 }}
                animate={{ ...expanded.target, borderRadius: 26, opacity: 1 }}
                exit={{ ...expanded.origin, borderRadius: 18, opacity: 0 }}
                transition={FLYOUT_SPRING}
              >
                <div className="hobbies__flyout-stage">
                  <PhotoCarousel
                    key={`${expanded.title}-${expanded.initialIndex}`}
                    images={PHOTOS_BY_CATEGORY[expanded.title]}
                    alt={expanded.title}
                    fit="contain"
                    initialIndex={expanded.initialIndex}
                  />
                </div>
                <span className="hobbies__flyout-title">{expanded.title}</span>
                <button type="button" className="hobbies__flyout-close" onClick={close} aria-label="关闭">
                  ×
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </section>
    </PageTransition>
  );
};

export default Hobbies;
