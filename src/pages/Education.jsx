import MagicBentoSection, { MagicBentoCard } from '../components/reactbits/MagicBento';
import PhotoCarousel from '../components/PhotoCarousel';
import PageTransition from '../components/PageTransition';
import './Education.css';

const TONGJI_PHOTOS = [
  'assets/images/education/tongji/同济大学.jpg',
  'assets/images/education/tongji/毕业设计.jpg',
  'assets/images/education/tongji/机械制图.JPEG',
  'assets/images/education/tongji/电工实验.JPEG'
];

const CAMBRIDGE_PHOTOS = [
  'assets/images/education/cambridge/剑桥大学.jpg',
  'assets/images/education/cambridge/4f453fc4b114030a1ccd2872a9be5c4c.jpg',
  'assets/images/education/cambridge/501b941783a5d169ba14a2a6cfadfe66.jpg',
  'assets/images/education/cambridge/6ced33dc7c0f5304dab36354ac5ce1e1.jpg',
  'assets/images/education/cambridge/ad8c8ad341ff78e26482dc2f4ada4fca.jpg',
  'assets/images/education/cambridge/c5ccf03ec34ee11c0257c42a48d6df4d.jpg',
  'assets/images/education/cambridge/f77224fed8f258c08b558e87b632f6bc.jpg'
];

const HONOR_CARDS = [
  {
    image: 'assets/images/education/honors-certificates/互联网+银奖-display.jpg',
    caption: '"互联网+"创新创业大赛 · 校级银奖 · 2023.06'
  },
  {
    image: 'assets/images/education/honors-certificates/挑战杯黑科技三等奖-display.jpg',
    caption: '"挑战杯"全国大学生课外学术科技作品竞赛 · 三等奖 · 2024.05'
  },
  {
    image: 'assets/images/education/honors-certificates/水球比赛-display.jpg',
    caption: '第六届全国大学生水球锦标赛 · 甲组季军 · 2024.06'
  }
];

const Education = () => {
  return (
    <PageTransition>
      <section className="education">
        <div className="education__content">
          <MagicBentoSection className="education__bento" spotlightRadius={600} glowColor="127, 168, 217">
            <div className="education__grid">
              <MagicBentoCard
                borderRadius="var(--radius-lg)"
                enableMagnetism={false}
                style={{
                  '--card-bg': 'color-mix(in srgb, var(--color-bg-elevated) 55%, transparent)',
                  '--card-border': 'rgba(238, 242, 247, 0.18)',
                  '--card-border-hover': '#7fa8d9'
                }}
              >
                <article className="education__card">
                  <div className="education__card-photo">
                    <PhotoCarousel images={TONGJI_PHOTOS} alt="同济大学" />
                  </div>
                  <div className="education__card-body">
                    <p className="education__eyebrow">本科 · 2021.09 – 2025.06</p>
                    <h2 className="education__school">同济大学</h2>
                    <p className="education__major">机械与能源工程学院 · 工业工程，辅修金融学</p>

                    <dl className="education__facts">
                      <div className="education__fact">
                        <dt>主修课程</dt>
                        <dd>运筹学、系统工程、统计学、物流与供应链、建模与仿真、质量管理、生产计划</dd>
                      </div>
                      <div className="education__fact">
                        <dt>导师</dt>
                        <dd>周健</dd>
                      </div>
                      <div className="education__fact">
                        <dt>研究方向</dt>
                        <dd>机加工设备换模效率提升 / 工业工程</dd>
                      </div>
                    </dl>
                  </div>
                </article>
              </MagicBentoCard>

              <MagicBentoCard
                borderRadius="var(--radius-lg)"
                enableMagnetism={false}
                style={{
                  '--card-bg': 'color-mix(in srgb, var(--color-bg-elevated) 55%, transparent)',
                  '--card-border': 'rgba(238, 242, 247, 0.18)',
                  '--card-border-hover': '#a9c6e8'
                }}
              >
                <article className="education__card">
                  <div className="education__card-photo">
                    <PhotoCarousel images={CAMBRIDGE_PHOTOS} alt="剑桥大学" />
                  </div>
                  <div className="education__card-body">
                    <p className="education__eyebrow">硕士 · 2025.10 – 2027.02</p>
                    <h2 className="education__school">剑桥大学</h2>
                    <p className="education__major">工程系 · MPhil in Industrial Systems, Manufacture and Management</p>

                    <dl className="education__facts">
                      <div className="education__fact">
                        <dt>主修课程</dt>
                        <dd>机械制造技术、供应链运营、数据科学、知识产权战略、创业发展</dd>
                      </div>
                      <div className="education__fact">
                        <dt>导师</dt>
                        <dd>Yongjiang Shi</dd>
                      </div>
                      <div className="education__fact">
                        <dt>研究方向</dt>
                        <dd>跨境电商物流与供应链网络设计</dd>
                      </div>
                    </dl>
                  </div>
                </article>
              </MagicBentoCard>
            </div>

            <section className="education__honors">
              <h2 className="education__section-title">在校荣誉</h2>

              <div className="education__honors-grid">
                {HONOR_CARDS.map(honor => (
                  <MagicBentoCard
                    key={honor.image}
                    borderRadius="var(--radius-lg)"
                    style={{
                      height: '240px',
                      '--card-border': 'rgba(238, 242, 247, 0.18)',
                      '--card-border-hover': '#7fa8d9'
                    }}
                  >
                    <figure className="education__honor-card">
                      <img src={honor.image} alt={honor.caption} className="education__honor-card-image" />
                      <figcaption className="education__honor-card-caption">{honor.caption}</figcaption>
                    </figure>
                  </MagicBentoCard>
                ))}

                <MagicBentoCard
                  borderRadius="var(--radius-lg)"
                  style={{
                    height: '240px',
                    '--card-bg': 'color-mix(in srgb, var(--color-bg-elevated) 55%, transparent)',
                    '--card-border': 'rgba(238, 242, 247, 0.18)',
                    '--card-border-hover': '#7fa8d9'
                  }}
                >
                  <div className="education__honor-card education__honor-card--text">
                    <p className="tilted-card-content__name">同济大学优秀学生奖学金</p>
                    <p className="tilted-card-content__meta">三等奖 · 两次获得 · 2022、2024</p>
                  </div>
                </MagicBentoCard>
              </div>
            </section>
          </MagicBentoSection>
        </div>
      </section>
    </PageTransition>
  );
};

export default Education;
