import FoldText from '../components/reactbits/FoldText';
import AccordionGallery from '../components/reactbits/AccordionGallery';
import MoltenMetal from '../components/reactbits/MoltenMetal';
import PageTransition from '../components/PageTransition';
import './Campus.css';

const photo = (folder, file) => ({ src: `assets/images/campus-life/${folder}/${file}` });

const ITEMS = [
  {
    label: '水球队长',
    description: '同济大学水球队 2023.06–2025.06｜带队夺得第六届全国大学生水球锦标赛甲组季军，获评国家水球二级运动员',
    images: [
      photo('water-polo-captain', '训练合照.jpg'),
      photo('water-polo-captain', '球队年会.JPEG'),
      photo('water-polo-captain', '季军奖杯-display.jpg'),
      photo('water-polo-captain', '5ec0045077b93a9df2ad4675a9f120a3.jpg'),
      photo('water-polo-captain', '9104d7bbaca859a8a8d7cd93c289b52c.jpg')
    ]
  },
  {
    label: '进博会志愿者',
    description: '第六届中国国际进口博览会 2023.11｜参与展会现场服务保障，负责观众引导与信息咨询',
    images: [
      photo('ciie-volunteer', 'IMG_2416.JPEG'),
      photo('ciie-volunteer', 'IMG_2109-display.jpg'),
      photo('ciie-volunteer', '6961ae4b-e20e-4253-8f04-0435c0eedae1-display.jpg')
    ]
  },
  {
    label: '学生会文艺部部长',
    description: '同济大学机械与能源工程学院学生会 2023.09–2024.09｜统筹策划学院大型晚会，负责人员对接与资源调度',
    images: [photo('student-union-art-dept', '9c2d42313cc92a47597994a5b3145234.jpg'), photo('student-union-art-dept', 'IMG_2933.JPEG')]
  },
  {
    label: '学生综合素质发展中心干事',
    description: '同济大学学生会 2021.10–2022.06｜参与举办校庆等大型活动的筹备与执行',
    images: [
      photo('student-union-quality-dept', '校庆项目组合照.JPEG'),
      photo('student-union-quality-dept', '校庆字幕.PNG'),
      photo('student-union-quality-dept', '歌手大赛项目组合照.JPEG'),
      photo('student-union-quality-dept', '歌手大赛工作人员工牌-display.jpg')
    ]
  }
];

const Campus = () => (
  <PageTransition>
    <section className="campus">
      <div className="campus__background">
        <MoltenMetal
          color1="#0f2a4a"
          color2="#3d8bd6"
          color3="#eef2f7"
          colorMode="frost"
          speed={0.18}
          scale={2}
          detail={4}
          glow={2}
          coreSize={0.13}
          swirl={1.3}
          fold={-0.2}
          blackPoint={0.015}
          brightness={1.3}
          grain
          grainIntensity={0.04}
          mouseInteraction={false}
          opacity={0.75}
        />
      </div>

      <div className="campus__content">
        <header className="campus__header">
          <h1 className="campus__title">
            <FoldText text="学生工作" splitBy="char" hinge="top" fontSize={48} fontWeight={600} color="#eef2f7" trigger="mount" duration={1.8} stagger={0.1} />
          </h1>
        </header>

        <div className="campus__gallery">
          <AccordionGallery items={ITEMS} defaultIndex={0} accentColor="#7fa8d9" overlayColor="#050a14" textColor="#eef2f7" height={520} gap={14} radius={20} />
        </div>
      </div>
    </section>
  </PageTransition>
);

export default Campus;
