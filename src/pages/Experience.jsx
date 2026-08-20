import { useEffect, useRef, useState } from 'react';
import PhotoCarousel from '../components/PhotoCarousel';
import PageTransition from '../components/PageTransition';
import './Experience.css';

const dateValue = (year, month) => year * 12 + month;
const RANGE_START = dateValue(2023, 8);
const RANGE_END = dateValue(2026, 3);
const percentFor = (year, month) => ((RANGE_END - dateValue(year, month)) / (RANGE_END - RANGE_START)) * 100;

const YEAR_MARKERS = [2026, 2025, 2024, 2023].map(year => ({
  year,
  percent: percentFor(year, year === 2026 ? 3 : 1)
}));

const INTERNSHIPS = [
  {
    key: 'bw',
    company: 'Bowers & Wilkins',
    title: '工艺流程实习生',
    duration: '2026.03',
    percent: percentFor(2026, 3),
    highlight: '碳纤维复合振膜自制可行性研究：三段产线设计 + CapEx/OpEx 全成本建模',
    photos: [
      'assets/images/experience/bowers-wilkins/图片1.png',
      'assets/images/experience/bowers-wilkins/图片2.png'
    ],
    summary:
      'Bowers & Wilkins的扬声器碳纤维振膜长期依赖外包生产，公司希望评估自主生产的可行性。设计了涵盖碳纤维蒙皮成型、发泡芯体制造、组装三阶段的完整产线方案，其中针对易爆易吸入的膨胀微球粉末设计了专门的安全处理流程，并通过仿真确定了最优批次规模，在此基础上建立了CapEx/OpEx全成本模型与敏感性分析。最终方案将单只振膜成本较外购下降33%-70%，所需CapEx约£215k，预计21个月内回本，5年累计回报约£390k。'
  },
  {
    key: 'csic',
    company: 'Cambridge Social Impact Consulting',
    title: '战略项目实习生',
    duration: '2026.01 – 2026.03',
    percent: percentFor(2026, 2),
    highlight: '市场测算 + 竞对分析 + 营销策略，识别£0.5-2M近期可触达市场，竞对评分3.75最高',
    photos: [
      'assets/images/experience/csic/1a5ca63f1-8c97-40ac-bb9d-13c8ec15ff7f3.png',
      'assets/images/experience/csic/57b3ec26-e818-4818-aa65-ceafc5aa6306.png',
      'assets/images/experience/csic/b75a8208-8277-4c7f-b47a-ed2f495de9ed.png'
    ],
    summary:
      'CSIC是一家剑桥可持续发展咨询公司，交付能力强但缺乏系统化获客方式，同时刚推出全新的Summer School项目，两条业务线都需要一套可执行的市场策略。完成了PESTEL/SWOT诊断与市场测算，筛出政府监管、金融服务两大优先客群，并对11家竞争对手做加权评分与定位分析，在此基础上设计了内容营销、精准获客、官网重构三支柱营销策略，交付6个月分阶段执行路线图。最终识别出£0.5-2M的近期可触达市场机会，CSIC在竞对评分中以3.75分排名最高。'
  },
  {
    key: 'iforce',
    company: 'iForce 物流中心',
    title: '运筹项目实习生',
    duration: '2026.01',
    percent: percentFor(2026, 1),
    highlight: '启发式算法优化订单分批 + 动态规划优化拣货路径，拣货用时降低8%-11%',
    photos: [
      'assets/images/experience/iforce/1c8e3ec1ef00895b16c512f463991b2f.jpg',
      'assets/images/experience/iforce/82c0d0e7270076f854b5702019a58539.jpg',
      'assets/images/experience/iforce/图片4.png'
    ],
    summary:
      'iForce需要为其最大客户仓库的拣选运营提效6%以支持业务增长。设计了基于锚点订单与批次质心邻近度的启发式算法优化订单分批，替代原有仅按到期时间和车容量分批的粗放逻辑，又设计了基于动态规划的算法求解拣货路径的全局最短巷道序列，并优化了手推车存放点布局。两套模型组合后将拣货用时降低8%(旺季)/11%(淡季)，超过公司设定的6%效率目标，折算人工成本每年可节省约£87,100。'
  },
  {
    key: 'ram',
    company: 'RAM Innovations',
    title: '运营项目实习生',
    duration: '2025.12',
    percent: percentFor(2025, 12),
    highlight: '半导体封装产线瓶颈分析 + 设备选型，£320K投资方案将产能提升约6倍',
    photos: [
      'assets/images/experience/ram-innovations/12b10dab-a08f-4f77-a49e-caad321214e3.png',
      'assets/images/experience/ram-innovations/89a13d46-a71d-4cc9-bffb-cc8c1a655591.png'
    ],
    summary:
      'RAM Innovations计划从定制化研发转向规模化量产，需要评估半导体先进封装产线的扩产可行性。通过流程图谱绘制与瓶颈分析定位晶粒贴装设备为核心产能约束，并主导设备选型——从5款候选机型经三道硬性筛选门收窄至3个方案，做成本、产能、交付周期与供应链安全风险的多维对比。最终推荐£319,510的投资方案，可将日产能提升至约6倍，并交付了分阶段扩产路线图。'
  },
  {
    key: 'deloitte',
    company: '德勤成都',
    title: '项目咨询实习生',
    duration: '2025.07 – 2025.09',
    percent: percentFor(2025, 8),
    highlight: '参与从江县"十五五"规划草案制定、德阳市老城区改造计划制定',
    photos: [
      'assets/images/experience/deloitte-chengdu/95a35e0e79242c234a3fafbe18f16ca8.jpg',
      'assets/images/experience/deloitte-chengdu/a200cfe368875e27015c7b33c3dfd90e.jpg'
    ],
    summary: '参与从江县"十五五"规划草案制定；参与德阳市政府某老城区改造计划制定。'
  },
  {
    key: 'guoji',
    company: '国机重型装备集团',
    title: '生产管理实习生',
    duration: '2024.07 – 2024.08',
    percent: percentFor(2024, 7),
    highlight: '数字化管理系统测试反馈 + 热处理工序精益方案，缩短30%等待时间',
    photos: [
      'assets/images/experience/guoji-heavy-equipment/R.jpg',
      'assets/images/experience/guoji-heavy-equipment/R (1).jpg'
    ],
    summary:
      '研究工厂新一代数字化管理系统的生产现场和工作流程，参与测试和反馈设计。负责先进精益生产管理的初步方法论设计，负责热处理工序待料周期的精益管理方案设计，缩短30%热处理等待时间。'
  },
  {
    key: 'tencent',
    company: '腾讯成都',
    title: '项目运营实习生',
    duration: '2023.08 – 2023.09',
    percent: percentFor(2023, 8),
    highlight: '新文创项目提案推进 + AI开悟平台与AI全球公开赛运营',
    photos: [
      'assets/images/experience/tencent-chengdu/IMG_1010.JPEG',
      'assets/images/experience/tencent-chengdu/8b9817752bdb5a04de9ae6843f26af3a.jpg',
      'assets/images/experience/tencent-chengdu/IMG_1321.JPEG'
    ],
    summary: '协助起草新文创项目提案，监督并推动项目进展；参与运营腾讯AI开悟平台及AI全球公开赛。'
  }
];

const Experience = () => {
  const viewportRef = useRef(null);
  const listRef = useRef(null);
  const itemRefs = useRef({});
  const offsetRef = useRef(0);
  const draggingRef = useRef(false);
  // >0 = the last movement revealed earlier cards (scrolling up toward the
  // top), <0 = revealed later cards (scrolling down toward the bottom).
  const directionRef = useRef(0);
  const [focusedKey, setFocusedKey] = useState(INTERNSHIPS[0].key);

  // The card list is its own self-contained scrolling panel: the header,
  // timeline and nav never move. Position within it is a plain translateY
  // offset applied directly to the list element (not native scrollTop), so
  // dragging/wheeling this panel can never leak into scrolling the page.
  const clampOffset = value => {
    const viewport = viewportRef.current;
    const list = listRef.current;
    if (!viewport || !list) return 0;
    const minOffset = Math.min(0, viewport.clientHeight - list.offsetHeight);
    return Math.min(0, Math.max(minOffset, value));
  };

  const updateFocus = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const viewportRect = viewport.getBoundingClientRect();
    const focusLine = viewportRect.top + viewportRect.height / 2;
    let closestKey = null;
    let closestDist = Infinity;
    Object.entries(itemRefs.current).forEach(([key, el]) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const dist = Math.abs(center - focusLine);
      if (dist < closestDist) {
        closestDist = dist;
        closestKey = key;
      }
    });
    if (closestKey) setFocusedKey(closestKey);
  };

  const applyOffset = (value, animate, duration = 0.5, easing = 'cubic-bezier(0.65, 0, 0.35, 1)') => {
    const list = listRef.current;
    if (!list) return;
    const clamped = clampOffset(value);
    const delta = clamped - offsetRef.current;
    if (delta !== 0) directionRef.current = delta;
    offsetRef.current = clamped;
    list.style.transition = animate ? `transform ${duration}s ${easing}` : 'none';
    list.style.transform = `translateY(${clamped}px)`;
    updateFocus();
  };

  const scrollToCard = key => {
    const list = listRef.current;
    const viewport = viewportRef.current;
    const el = itemRefs.current[key];
    if (!list || !viewport || !el) return;
    const target = viewport.clientHeight / 2 - (el.offsetTop + el.offsetHeight / 2);
    applyOffset(target, true);
  };

  // Soft auto re-center once a scroll settles: nudge the newly-focused card
  // toward the middle rather than snapping it dead-on. Scrolling down tends
  // to overshoot upward — the previously-focused card above (often larger,
  // mid-collapse) drags things up past center as it shrinks — so it needs a
  // real downward correction to pull back. Scrolling up doesn't get that
  // same overshoot, but each card still needs enough breathing room, so it
  // gets its own real upward correction too. Slower and longer than the
  // expand/collapse transition itself (0.5s), and kicked off while that's
  // still running (see the settle-timeout below), so the two motions blend
  // into one continuous drift instead of reading as "expand, then snap".
  const softRecenter = key => {
    const viewport = viewportRef.current;
    const el = itemRefs.current[key];
    if (!viewport || !el) return;
    const fullTarget = viewport.clientHeight / 2 - (el.offsetTop + el.offsetHeight / 2);
    let diff = fullTarget - offsetRef.current;
    // Only ever settle back opposite to the scroll we just did (down-scroll
    // nudges the card back down on screen, up-scroll nudges it back up) —
    // never continue further in the same direction as the scroll, even if
    // that's technically closer to dead-center. If the natural target is
    // already on the "continue scrolling" side, skip correcting at all.
    if (directionRef.current < 0 && diff < 0) diff = 0;
    if (directionRef.current > 0 && diff > 0) diff = 0;
    const factor = directionRef.current > 0 ? 0.45 : 0.4;
    const blended = offsetRef.current + diff * factor;
    applyOffset(blended, true, 1, 'cubic-bezier(0.22, 1, 0.36, 1)');
  };

  // Center the first card on mount, and keep the offset valid on resize.
  useEffect(() => {
    scrollToCard(INTERNSHIPS[0].key);
    const onResize = () => applyOffset(offsetRef.current, false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-center whichever card just became focused — kicked off just after the
  // expand/collapse animation starts (not after it finishes), so the drift
  // and the expand read as one continuous motion instead of a snap tacked on
  // at the end. Never fires while the user is actively dragging, so it
  // doesn't fight their input.
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!draggingRef.current) softRecenter(focusedKey);
    }, 60);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedKey]);

  // Drag and wheel both move the same internal offset — the panel scrolls
  // itself; nothing outside it (title, timeline, nav) is ever touched.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    let startY = 0;
    let startOffset = 0;

    const onPointerDown = e => {
      if (e.button !== 0) return;
      draggingRef.current = true;
      startY = e.clientY;
      startOffset = offsetRef.current;
      viewport.classList.add('is-dragging');
    };

    const onPointerMove = e => {
      if (!draggingRef.current) return;
      applyOffset(startOffset + (e.clientY - startY), false);
    };

    const endDrag = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      viewport.classList.remove('is-dragging');
    };

    const onWheel = e => {
      e.preventDefault();
      applyOffset(offsetRef.current - e.deltaY, false);
    };

    viewport.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    viewport.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      viewport.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', endDrag);
      window.removeEventListener('pointercancel', endDrag);
      viewport.removeEventListener('wheel', onWheel);
    };
  }, []);

  const activePercent = INTERNSHIPS.find(item => item.key === focusedKey)?.percent ?? 0;

  return (
    <PageTransition>
      <section className="experience">
        <div className="experience__content">
          <div className="experience__layout">
            <aside className="experience__timeline">
              <div className="experience__timeline-track">
                {YEAR_MARKERS.map(marker => (
                  <div key={marker.year} className="experience__timeline-year" style={{ top: `${marker.percent}%` }}>
                    {marker.year}
                  </div>
                ))}
                {INTERNSHIPS.map(item => (
                  <button
                    key={item.key}
                    type="button"
                    className={`experience__timeline-tick ${focusedKey === item.key ? 'is-active' : ''}`}
                    style={{ top: `${item.percent}%` }}
                    onClick={() => scrollToCard(item.key)}
                    aria-label={item.company}
                  />
                ))}
                <div className="experience__timeline-indicator" style={{ top: `${activePercent}%` }} />
              </div>
            </aside>

            <div className="experience__list-viewport" ref={viewportRef}>
              <div className="experience__list" ref={listRef}>
                {INTERNSHIPS.map(item => {
                  const isFocused = focusedKey === item.key;
                  return (
                    <article
                      key={item.key}
                      ref={el => {
                        itemRefs.current[item.key] = el;
                      }}
                      data-key={item.key}
                      className={`experience-item ${isFocused ? 'is-focused' : ''}`}
                    >
                      <div className="experience-item__bar">
                        <span className="experience-item__bar-company">{item.company}</span>
                      </div>

                      <div className="experience-item__detail">
                        <div className={`experience-item__detail-inner ${item.photos.length ? 'experience-item__detail-inner--with-photo' : ''}`}>
                          <div className="experience-item__detail-text">
                            <p className="experience-item__eyebrow">{item.duration}</p>
                            <p className="experience-item__role">{item.title}</p>
                            <p className="experience-item__highlight">{item.highlight}</p>
                            <p className="experience-item__summary">{item.summary}</p>
                          </div>

                          {item.photos.length > 0 && (
                            <div className="experience-item__media">
                              <PhotoCarousel images={item.photos} alt={item.company} />
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Experience;
