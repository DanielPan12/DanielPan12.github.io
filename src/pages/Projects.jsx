import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SpecularButton from '../components/reactbits/SpecularButton';
import PageTransition from '../components/PageTransition';
import './Projects.css';

// Deterministic per-bubble hash so size varies across the wall without
// randomising on every render — stable because it's derived from the
// project key.
const hashFor = key => {
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return hash;
};

const sizeFor = (key, name) => {
  const hash = hashFor(key);
  const base = 140 + (hash % 50);
  const lengthBonus = Math.min(name.length * 2, 56);
  return Math.round(base + lengthBonus * 0.5);
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const TAGS = ['产品开发与评测', '算法与建模仿真', '数据处理与分析', '供应链管理与运营', '工业工程与精益改善'];

const PROJECTS = [
  {
    key: 'a3c',
    name: '智能制造系统的自主智能协同优化',
    duration: '2023.01 – 2024.04',
    role: '算法开发（5人团队）',
    tags: ['算法与建模仿真', '供应链管理与运营', '数据处理与分析'],
    strong: true,
    highlight: 'MAS+DRL智能制造框架，A3C应用于仓储调度并与PPO对比，获多项竞赛奖励',
    summary:
      '面向工业4.0背景下智能制造系统的自主化与协同优化，构建基于多智能体系统与深度强化学习的整体框架，划分ERP/MES/底层控制三层，用simpy搭建仿真环境，用Process Simulate/Plant Simulation做数字孪生建模。基于马尔科夫决策过程用gym库搭建仓储AGV调度环境，主要负责A3C算法在该环境中的应用与环境对接，并与PPO及固定算法做多指标对比测试。A3C相比PPO在仓储调度场景下呈现更优的结果稳定性，团队改进的MAPPO算法将车间调度Makespan由236降至201，项目获"挑战杯""互联网+"等竞赛的多项奖励。'
  },
  {
    key: 'restaurant',
    name: '餐厅排队系统的建模与仿真',
    duration: '2024.03 – 2024.06',
    role: '组长（4人团队）',
    tags: ['算法与建模仿真', '数据处理与分析', '供应链管理与运营'],
    strong: true,
    highlight: 'SimPy离散事件仿真，10000次蒙特卡洛测算四组决策，日利润最优方案$800.66',
    summary:
      '用Python SimPy对虚构墨西哥餐厅的运营做离散事件仿真，将顾客到店、排队、点餐、传菜、结账全流程建模为随机变量驱动的资源竞争过程，对餐桌配置、人员配置、技术投资、商圈扩张四组决策问题分别运行10000组蒙特卡洛模拟。测试5种餐桌组合确认原始配置已是局部最优，发现增聘厨师是负ROI决策，而优化人员结构反而使利润提升至峰值；验证了手持点餐设备的正投资回报；测算商圈扩张后若不同步增员将导致总等待时间恶化至33分钟。最终给出的全局最优方案将日利润提升至$800.66，平均排队时间压缩至40.66秒。'
  },
  {
    key: 'bike',
    name: '自行车制动线装配优化和改进',
    duration: '2024.03 – 2024.06',
    role: '组长（3人团队）',
    tags: ['工业工程与精益改善', '数据处理与分析'],
    strong: true,
    highlight: 'OCRA指数定位人因风险，穿线工序从47秒降至约27秒',
    summary:
      '分析捷安特自行车下穿管线装配工序的瓶颈与作业员职业健康风险，通过工序流程图与产品工序分析定位瓶颈为男性工人的穿线工序，并用OCRA指数评估发现4名作业员中3人存在手臂持续抬升超过90°的不良姿势，判定为肩部职业健康风险。按"快速大成功/快速小成功/长期但有用/下次一定"矩阵对四项对策排序：设计可拆卸配重穿线装置利用重力辅助穿线、更灵活的工序动态分配、员工培训与工序标准化、重新设计可升降旋转工作台。穿线装置方案将该工序从47秒缩短至约27秒，改造成本约70元/件，基本消除瓶颈。'
  },
  {
    key: 'smed',
    name: '本科毕业设计《J公司机加工设备的换模作业效率提升研究》',
    duration: '2025.01 – 2025.06',
    role: '独立负责人',
    tags: ['工业工程与精益改善', '数据处理与分析'],
    strong: true,
    highlight: 'SMED换模：43步骤内外部作业分类，换模时间从20-25分钟压缩至约6分钟',
    summary:
      'J公司机加工车间的立式抽管机换模严重依赖人工经验，耗时20-25分钟，制约多品种小批量生产的柔性。应用SMED快速换模理论，通过现场调研与录像分析将换模流程拆解为43个步骤并逐一做内部/外部作业分类，识别出模具存放分散、操作台高度调整、物料准备与换模串行执行三类核心瓶颈，针对套模安装环节设计功能性夹具结构优化方案，针对退料模/芯轴装卸设计标准化工具接口，并建立换模参数数据库推动换模从经验驱动转向数据驱动。套模拆装时间从140秒缩短至约25秒，通过流程重构与并行作业，整体换模时间从20-25分钟压缩至约6分钟。'
  },
  {
    key: 'thesis',
    name: '中国跨境电商平台英国物流本地化路径研究（硕士毕业论文）',
    duration: '2026.05 – 2026.08',
    role: '独立研究者',
    tags: ['供应链管理与运营'],
    strong: true,
    highlight: '质性比较案例研究：Temu/TikTok Shop/JD三平台物流路径，提出"阈值机制"替代经典理论',
    summary:
      '剑桥大学MPhil毕业论文，研究中国跨境电商平台如何在英国市场构建物流体系。基于国际化、平台、物流三支文献构建"物流本地化五阶段模型"，采用质性比较案例研究方法，选取Temu、TikTok Shop、JD三个商业逻辑迥异的平台做最大差异化案例对比，对运营物流人员、第三方物流合作伙伴及零售战略高管共6人做半结构化访谈，并与公开里程碑时间线交叉核验。发现资产密集度与投资触发机制是两个此前被混为一谈、实际相互独立的变量，企业只在"当前配置成本超过下一阶段"时才会升级配置；识别出跨三案例的五条结构性规律，提出"阈值机制"取代经典的Uppsala渐进国际化轨迹理论。'
  },
  {
    key: 'm1',
    name: '喷枪产品制造运营方案设计与全成本建模',
    duration: '2025.10 – 2025.12',
    role: '团队项目',
    tags: ['产品开发与评测', '供应链管理与运营'],
    strong: true,
    highlight: 'Make-or-Buy决策 + 车间布局 + 设备选型，单位成本£7.55（低于£10目标）',
    summary:
      '为一款£10零售价的喷水枪设计整套制造运营方案，对约30个BOM物料按七大类别逐一做Make-or-Buy决策分析，设计五种不同工艺路线下的车间布局，完成注塑机夹紧力与成型周期的工程计算并据此选型，向中国、英国的注塑厂及零部件供应商实际询价获取真实报价用于验证假设。建立完整的CapEx（£3.64M）/OpEx（£3.24M/年）成本模型，最终单位成本£7.55，低于£10目标，并完成风险登记册，将可能性×严重度评分缓解后的剩余风险从最高6分降至2分。'
  },
  {
    key: 'jobhuntbot',
    name: 'JobHuntBot：AI Agent驱动的求职工作流与进度追踪系统',
    duration: '2026.06 – 2026.08',
    role: '独立完成 / 独立开发者',
    tags: ['产品开发与评测'],
    strong: true,
    highlight: '本地求职自动化系统，开源发布后播放量超40万、GitHub 400+ star',
    summary:
      '针对2027届校招设计并主导开发（与AI编程Agent协作）了一套本地求职自动化系统，包含候选人信息/岗位筛选规则/简历路由/经历匹配矩阵等结构化数据层，零依赖Node.js本地服务器与可写API，纯原生前端的实时进度看板，并对接Playwright实现浏览器自动化以完成表单填写与投递。将系统从一个开源模板重构为独立项目JobHuntBot，脱敏后发布为开源项目，供其他求职者复用。项目发布后通过自媒体渠道做内容推广，累计播放量超40万，GitHub仓库获得400+ star。'
  },
  {
    key: 'app-mps-lbp',
    name: '生产计划与装配线平衡建模（APP/MPS/LBP）',
    duration: '2024.03 – 2024.06',
    role: '组长（3人团队）',
    tags: ['算法与建模仿真', '供应链管理与运营', '工业工程与精益改善', '数据处理与分析'],
    strong: false,
    highlight: '30组合成本全枚举，Gurobi精确解与双种群遗传算法交叉验证装配线平衡',
    summary:
      '以某车间年度生产计划为背景，完成综合生产计划、主生产计划、装配线平衡三层规划。对10组备选方案×3种产能策略共30个组合做全成本测算，识别出最低成本方案；推导毛需求到可承诺量的完整计算链并引入时间栅栏机制；用Gurobi建立装配线平衡的0-1整数规划精确求解，并自行用MATLAB实现双种群遗传算法作为大规模场景的启发式替代，精确解与GA解相互验证。'
  },
  {
    key: 'jsp',
    name: 'Job Shop车间调度问题（JSP）多算法求解与对比',
    duration: '2024.03 – 2024.06',
    role: '组长',
    tags: ['算法与建模仿真', '供应链管理与运营', '数据处理与分析'],
    strong: false,
    highlight: 'Gurobi精确解 + GA + 模拟退火混合算法(GASA)，在FT10/FT20上优于纯GA',
    summary:
      '对经典JSP在FT6/FT10/FT20三个标准benchmark上做精确解与元启发式解的系统对比，建立混合整数规划模型用Gurobi求解，实现基于工序编码的遗传算法并采用POX交叉保证子代可行性。诊断出GA在大规模算例上收敛停滞后，将模拟退火的Metropolis准则嵌入GA的子代更新环节，构建GASA混合算法，在FT10/FT20上均优于纯GA，验证了"全局搜索+局部跳出"组合的有效性。'
  },
  {
    key: 'mouse',
    name: '基于手部关键点检测的人因学鼠标有效性验证',
    duration: '2023.03 – 2023.06',
    role: '组长',
    tags: ['产品开发与评测', '数据处理与分析'],
    strong: false,
    highlight: 'MediaPipe量化握持姿态，发现男女反馈显著分化',
    summary:
      '用Google MediaPipe手部关键点检测将主观舒适度转化为可测关节角度，对照国标人体尺寸数据评估市面人因学鼠标是否真正达到宣传效果。先做单人预实验筛除无区分度的尺桡偏移指标，聚焦静态握持姿态，正式测评3款鼠标并对8名被试做客观角度测量与主观访谈双轨评估。发现立式鼠标确实更符合手部自然休息位姿态，但主观反馈显著性别分化，证实了女性专用款设计的必要性。'
  },
  {
    key: 'fatigue',
    name: '眨眼频率与视距测量的视疲劳量化实验',
    duration: '2023.03 – 2023.06',
    role: '组长',
    tags: ['产品开发与评测', '数据处理与分析'],
    strong: false,
    highlight: '依据国标设计实验，量化不同视频刺激对视疲劳的短期影响',
    summary:
      '依据国家标准GB/T 40230.2-2021设计实验，用程序统计眨眼次数，以能看清视力表最后一行的最短视距作为视力代理指标，量化电子屏幕使用对视疲劳的影响。10名被试早晚各测一次，依次观看舒缓类、强刺激-光污染类、强刺激-兴趣类三段视频，记录观看前后的视距变化与眨眼率。发现强刺激视频下眨眼率显著下降，短时强光刺激对视距的影响大于长时间用眼，并识别出1名异常值被试后回访确认原因做针对性剔除处理。'
  },
  {
    key: 'emg',
    name: '运动器械功效验证：哑铃负重与俯卧撑板表面肌电（EMG）实验',
    duration: '2023.03 – 2023.06',
    role: '组员',
    tags: ['产品开发与评测', '数据处理与分析'],
    strong: false,
    highlight: '四通道表面肌电实验，证伪俯卧撑板分区锻炼的宣传',
    summary:
      '用表面肌电四通道采集做两个子实验。哑铃实验对8名被试的负重×左右手×性别做多因素分析，剔除信号异常被试后发现负重增加主要提升肱二头肌与肱三头肌激活，肌肉疲劳的表现是动作周期变长而非RMS下降；俯卧撑板实验按四种标称锻炼姿势对3名被试做同一肌肉的横向对比，结果混乱无序，证伪了俯卧撑板分区标称的宣传效果。'
  },
  {
    key: 'game-recommender',
    name: '多智能体游戏推荐系统',
    duration: '2026.04',
    role: '独立开发者',
    tags: ['产品开发与评测'],
    strong: false,
    highlight: 'CrewAI三agent流水线，本地小模型练习项目，定位并归因三类系统性失败',
    summary:
      '基于CrewAI设计三层串行agent流水线，用YAML配置化管理agent角色与任务，用显式context依赖控制agent间信息传递，在prompt层设计约束机制将模糊自然语言输入转化为结构化检索条件。采用Ollama本地部署1B小模型加LiteLLM适配，实现零API成本与一键复现。构建典型/复杂/边界三档测试集，定位并归因三类系统性失败：事实性幻觉、长链路指令遵循衰减、中间推理泄漏至终稿，提出增加校验agent、接入检索工具、改用结构化JSON交接的改进方向。这是一个练习项目，用的是本地小模型，未接入真实检索，没有可量化的业务指标，价值在于验证agent系统设计与失败归因能力。'
  }
];

const PROJECTS_BY_KEY = Object.fromEntries(PROJECTS.map(p => [p.key, p]));

// Scatter positions via a golden-angle (phyllotaxis) spiral + per-item hash
// jitter — irregular and non-aligned rather than falling into rows/columns —
// then relaxed with a few passes of pairwise repulsion so same-size bubbles
// don't overlap. Computed in a design-space pixel box matching the wall's
// on-screen proportions (rescaled once the real box is measured), so the
// repulsion math respects actual bubble sizes. Fully deterministic; this is
// just the resting seed — actual motion is driven by the physics loop below.
const GOLDEN_ANGLE = 137.508 * (Math.PI / 180);
const WALL_W = 1344;
const WALL_H = 560;
const EDGE_MARGIN = 18;
// Small on purpose: this is the resting breathing-room between circles, not
// how close a fast impact is allowed to bring them — the spring collision
// only starts pushing back once bubbles are within this distance of true
// edge contact, so a large gap here would absorb the whole "squeeze" before
// it ever became visible overlap.
const BUBBLE_GAP = 4;

const clampToBox = (p, w, h) => {
  const half = p.size / 2;
  p.x = clamp(p.x, half + EDGE_MARGIN, w - half - EDGE_MARGIN);
  p.y = clamp(p.y, half + EDGE_MARGIN, h - half - EDGE_MARGIN);
};

// Pairwise repulsion: nudges any two circles closer than their combined
// radius (+ gap) apart. Used both to settle the initial seed and, every
// frame, to keep continuously-wandering bubbles from overlapping.
const relax = (positions, w, h, iterations) => {
  for (let iter = 0; iter < iterations; iter += 1) {
    for (let i = 0; i < positions.length; i += 1) {
      for (let j = i + 1; j < positions.length; j += 1) {
        const a = positions[i];
        const b = positions[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
        const minDist = a.size / 2 + b.size / 2 + BUBBLE_GAP;
        if (dist < minDist) {
          const overlap = (minDist - dist) / 2;
          const nx = dx / dist;
          const ny = dy / dist;
          a.x -= nx * overlap;
          a.y -= ny * overlap;
          b.x += nx * overlap;
          b.y += ny * overlap;
        }
      }
    }
    positions.forEach(p => clampToBox(p, w, h));
  }
};

const buildSeed = (w, h) => {
  const positions = PROJECTS.map((project, index) => {
    const size = sizeFor(project.key, project.name);
    const t = index / PROJECTS.length;
    const radius = Math.sqrt(t);
    const angle = index * GOLDEN_ANGLE;
    const hash = hashFor(project.key);
    const jitterX = (((hash % 100) / 100) - 0.5) * w * 0.06;
    const jitterY = ((Math.floor(hash / 100) % 100) / 100 - 0.5) * h * 0.1;
    return {
      key: project.key,
      size,
      x: w / 2 + radius * w * 0.46 * Math.cos(angle) + jitterX,
      y: h / 2 + radius * h * 0.46 * Math.sin(angle) + jitterY,
      vx: 0,
      vy: 0
    };
  });
  positions.forEach(p => clampToBox(p, w, h));
  relax(positions, w, h, 80);
  return positions;
};

const INITIAL_SEED = buildSeed(WALL_W, WALL_H);
const INITIAL_BY_KEY = Object.fromEntries(INITIAL_SEED.map(p => [p.key, { x: p.x, y: p.y }]));

// Continuous "lava lamp" physics tuning: gentle random-walk drift, damping,
// a repulsion "hole" wherever a bubble is expanded, and a buoyancy pull that
// only kicks in once a tag filter is active.
// Wander is a fresh, independent random push direction every frame — not a
// slowly-turning heading. A persistent heading (accumulated turn-by-turn)
// diffuses in direction far slower than it looks: at a plausible turn rate
// it can take on the order of minutes to fully randomise, which reads as
// "this particular bubble always drifts left/right" even though nothing
// deliberately favours a side — it's really just a heading stuck mid-walk.
// Redrawing the direction independently each frame has no memory to get
// stuck in, so no bubble can develop that kind of apparent personality.
const WANDER_ACCEL = 100; // px/s^2
const DAMPING_PER_SEC = 0.56; // velocity fraction retained after 1s — a touch higher so higher speeds coast smoothly instead of decelerating abruptly
const MAX_SPEED = 200; // px/s
const BUOY_ACCEL = 400; // px/s^2 toward top (matched) / bottom (dimmed)
// Mutual repulsion alone has no force undoing it — once bubbles settle into
// two loose clusters there's nothing to pull them back across the middle,
// so the same bubbles end up permanently stuck on the same side. This weak
// spring toward the wall's center (only when resting, i.e. no filter) stops
// any one bubble being permanently marooned at an edge. It's deliberately
// gentle and continuous — strong enough to slowly break up stranding over
// time, but with no discrete "event" that could itself look like a jolt.
// Bubbles are allowed to coast down to a near-standstill; that's fine.
const CENTER_PULL = 0.02; // px/s^2 per px of horizontal offset from center
const ACTIVE_PUSH_RADIUS = 300;
const ACTIVE_PUSH_EASE = 11; // per-second
const CENTER_EASE = 9; // per-second, how fast the expanding bubble reaches center
// Bubble-bubble collision is a damped spring (penalty force) rather than a
// hard positional constraint: overlap depth is allowed to build up under
// impact, proportional to how fast the two bubbles were closing, and the
// spring pushes back proportionally on both sides (Newton's third law) —
// so a harder hit visibly compresses more and kicks the other bubble away
// harder, rather than every contact looking identical regardless of speed.
// Damping is set just above critical (2*sqrt(stiffness)) so the compression
// eases back out in one smooth motion instead of bouncing/oscillating.
// COLLISION_DAMPING_RAMP matters more than it looks: at the instant two
// bubbles first touch, overlap is ~0 but their closing speed can be large —
// applying full damping strength right then means the *entire* response
// comes from one single-frame spike driven purely by velocity, which is
// exactly what a sudden mid-air direction change looks like. Ramping the
// damping in gradually over the first few px of overlap means the spring
// (proportional to overlap, and therefore continuous) leads the response
// and the damper only fully engages once there's real contact depth.
const COLLISION_STIFFNESS = 110; // px/s^2 per px of overlap
const COLLISION_DAMPING = 21; // px/s^2 per px/s of closing speed, at full ramp
const COLLISION_DAMPING_RAMP = 5; // px of overlap over which damping ramps from 0 to full
const COLLISION_MAX_OVERLAP = 22; // px — hard safety cap so an unusually fast hit can't sink bubbles deep into each other and look "soft"
// A purely central (normal-direction) spring can deadlock: if a buoyant
// bubble ends up almost exactly underneath a blocking one, the collision
// force is nearly all vertical too, so it just presses straight up into the
// blocker forever — buoyancy pushing up, the spring pushing back down, in a
// stall that reads as trembling in place rather than motion. This sideways
// "slip" nudges both bubbles apart horizontally whenever a contact is
// close to vertically stacked, proportional to how stacked it is, so a
// blocked bubble slides around its obstacle instead of stalling under it.
// The push direction is decided by whichever bubble is already very
// slightly left/right of the other (or, failing that, a stable per-pair
// comparison) — never randomly — so it can't flip back and forth frame to
// frame and add jitter of its own.
const SLIP_STIFFNESS = 40; // px/s^2 per px of overlap, at maximum stackedness
const STACK_THRESHOLD = 0.35; // only engage once contact is at least this vertical (0 = side-by-side, 1 = perfectly stacked)
// The wall boundary uses the same damped-spring approach as bubble-bubble
// contact (see above) instead of an instant clamp-and-flip, so hitting an
// edge decelerates smoothly rather than discontinuously reversing velocity
// in a single frame.
const BOUNDARY_STIFFNESS = 130;
const BOUNDARY_DAMPING = 22;
const BOUNDARY_DAMPING_RAMP = 6;
const BOUNDARY_MAX_OVERLAP = 16;

const Projects = () => {
  const [activeTag, setActiveTag] = useState(null);
  const [activeKey, setActiveKey] = useState(null);

  const wallRef = useRef(null);
  const bubbleElRefs = useRef({});
  const activeKeyRef = useRef(null);
  const activeTagRef = useRef(null);
  const stateRef = useRef(null);
  if (!stateRef.current) {
    stateRef.current = { w: WALL_W, h: WALL_H, bubbles: INITIAL_SEED.map(p => ({ ...p })) };
  }

  const isDimmed = key => {
    if (!activeTag) return false;
    const project = PROJECTS.find(p => p.key === key);
    return !project.tags.includes(activeTag);
  };

  useEffect(() => {
    activeKeyRef.current = activeKey;
  }, [activeKey]);

  useEffect(() => {
    activeTagRef.current = activeTag;
  }, [activeTag]);

  useEffect(() => {
    if (!activeKey) return undefined;
    const onKeyDown = e => {
      if (e.key === 'Escape') setActiveKey(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeKey]);

  // Keep the physics box in sync with the wall's real rendered size —
  // measured via ResizeObserver's own contentRect (transform-immune, unlike
  // getBoundingClientRect during the page-transition entrance animation),
  // rescaling existing bubble positions proportionally so layout doesn't
  // jump when the box is first measured.
  useEffect(() => {
    const wall = wallRef.current;
    if (!wall) return undefined;
    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width <= 0 || height <= 0) return;
      const state = stateRef.current;
      const scaleX = width / state.w;
      const scaleY = height / state.h;
      if (scaleX !== 1 || scaleY !== 1) {
        state.bubbles.forEach(b => {
          b.x *= scaleX;
          b.y *= scaleY;
        });
      }
      state.w = width;
      state.h = height;
    });
    observer.observe(wall);
    return () => observer.disconnect();
  }, []);

  // Continuous "lava lamp" simulation: gentle random-walk drift, pairwise
  // collision resolution, and boundary containment for every resting
  // bubble, plus two extra forces layered on top — a repulsion "hole"
  // wherever a bubble is expanded (so others jostle out of its way), and a
  // buoyancy pull once a tag filter is active (matched bubbles float up,
  // filtered-out ones sink, colliding with each other along the way).
  // Positions are written straight to the DOM every frame rather than
  // through React state, so 60fps motion doesn't force 13-node re-renders.
  useEffect(() => {
    let frameId;
    let lastTime = performance.now();

    const step = now => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      const state = stateRef.current;
      const { w, h, bubbles } = state;
      const active = activeKeyRef.current;
      const tag = activeTagRef.current;
      const cx = w / 2;
      const cy = h / 2;

      bubbles.forEach(b => {
        if (b.key === active) {
          b.x += (cx - b.x) * Math.min(1, CENTER_EASE * dt);
          b.y += (cy - b.y) * Math.min(1, CENTER_EASE * dt);
          b.vx = 0;
          b.vy = 0;
          return;
        }

        const wanderAngle = Math.random() * Math.PI * 2;
        b.vx += Math.cos(wanderAngle) * WANDER_ACCEL * dt;
        b.vy += Math.sin(wanderAngle) * WANDER_ACCEL * dt;

        // Horizontal centering always applies (stops permanent left/right
        // teams); vertical centering only applies at rest — once a filter
        // sorts bubbles top/bottom, buoyancy should own the y-axis instead.
        b.vx += (cx - b.x) * CENTER_PULL * dt;
        if (!tag) {
          b.vy += (cy - b.y) * CENTER_PULL * dt;
        }

        if (tag) {
          const dimmed = !PROJECTS_BY_KEY[b.key].tags.includes(tag);
          b.vy += (dimmed ? BUOY_ACCEL : -BUOY_ACCEL) * dt;
        }

        if (active) {
          const dx = b.x - cx;
          const dy = b.y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const minDist = ACTIVE_PUSH_RADIUS + b.size / 2 + BUBBLE_GAP;
          if (dist < minDist) {
            const push = (minDist - dist) * Math.min(1, dt * ACTIVE_PUSH_EASE);
            b.x += (dx / dist) * push;
            b.y += (dy / dist) * push;
          }
        }

        const damp = Math.pow(DAMPING_PER_SEC, dt);
        b.vx *= damp;
        b.vy *= damp;
        const speed = Math.hypot(b.vx, b.vy);
        if (speed > MAX_SPEED) {
          b.vx = (b.vx / speed) * MAX_SPEED;
          b.vy = (b.vy / speed) * MAX_SPEED;
        }

        b.x += b.vx * dt;
        b.y += b.vy * dt;
      });

      // Bubble-bubble collision: a damped spring pushes overlapping bubbles
      // apart, rather than snapping them to a fixed non-overlapping distance
      // every frame. That distinction matters for two things the physics
      // needs to do: let harder/faster impacts compress a little further
      // before rebounding (a slow drift-into-contact barely overlaps; a fast
      // kick-driven impact overlaps more, proportional to how hard it hit),
      // and push back on the other bubble proportionally harder too, since
      // both sides feel the same spring force (Newton's third law) — a soft
      // graze barely nudges the other bubble, a hard hit sends it off with
      // real velocity. COLLISION_MAX_OVERLAP is a hard cap so an unusually
      // fast hit can't sink bubbles deep into each other and look "soft".
      for (let i = 0; i < bubbles.length; i += 1) {
        for (let j = i + 1; j < bubbles.length; j += 1) {
          const a = bubbles[i];
          const b = bubbles[j];
          if (a.key === active || b.key === active) continue;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
          const minDist = a.size / 2 + b.size / 2 + BUBBLE_GAP;
          if (dist < minDist) {
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = minDist - dist;
            const dampingRamp = Math.min(1, overlap / COLLISION_DAMPING_RAMP);

            const relVel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
            const springForce = COLLISION_STIFFNESS * overlap - COLLISION_DAMPING * dampingRamp * relVel;
            const impulse = Math.max(0, springForce) * dt;
            a.vx -= nx * impulse;
            a.vy -= ny * impulse;
            b.vx += nx * impulse;
            b.vy += ny * impulse;

            const stackedness = Math.abs(ny);
            if (stackedness > STACK_THRESHOLD) {
              const stackFactor = (stackedness - STACK_THRESHOLD) / (1 - STACK_THRESHOLD);
              const sign = Math.abs(dx) > 0.5 ? Math.sign(dx) : (hashFor(a.key) < hashFor(b.key) ? 1 : -1);
              const slip = stackFactor * SLIP_STIFFNESS * overlap * dt;
              a.vx -= sign * slip;
              b.vx += sign * slip;
            }

            if (overlap > COLLISION_MAX_OVERLAP) {
              const hardCorrection = (overlap - COLLISION_MAX_OVERLAP) * 0.5;
              a.x -= nx * hardCorrection;
              a.y -= ny * hardCorrection;
              b.x += nx * hardCorrection;
              b.y += ny * hardCorrection;
            }
          }
        }
      }

      // Wall contact uses the same damped-spring shape as bubble-bubble
      // collision (including the damping ramp) instead of an instant
      // clamp-and-flip, so hitting an edge decelerates smoothly instead of
      // discontinuously reversing velocity within a single frame.
      const boundaryImpulse = (overlap, worseningVel) => {
        if (overlap <= 0) return 0;
        const ramp = Math.min(1, overlap / BOUNDARY_DAMPING_RAMP);
        const force = BOUNDARY_STIFFNESS * overlap + BOUNDARY_DAMPING * ramp * worseningVel;
        return Math.max(0, force) * dt;
      };

      bubbles.forEach(b => {
        if (b.key === active) return;
        const half = b.size / 2;
        const minX = half + EDGE_MARGIN;
        const maxX = w - half - EDGE_MARGIN;
        const minY = half + EDGE_MARGIN;
        const maxY = h - half - EDGE_MARGIN;

        const leftOverlap = minX - b.x;
        if (leftOverlap > 0) {
          b.vx += boundaryImpulse(leftOverlap, -b.vx);
          if (leftOverlap > BOUNDARY_MAX_OVERLAP) b.x = minX - BOUNDARY_MAX_OVERLAP;
        }
        const rightOverlap = b.x - maxX;
        if (rightOverlap > 0) {
          b.vx -= boundaryImpulse(rightOverlap, b.vx);
          if (rightOverlap > BOUNDARY_MAX_OVERLAP) b.x = maxX + BOUNDARY_MAX_OVERLAP;
        }
        const topOverlap = minY - b.y;
        if (topOverlap > 0) {
          b.vy += boundaryImpulse(topOverlap, -b.vy);
          if (topOverlap > BOUNDARY_MAX_OVERLAP) b.y = minY - BOUNDARY_MAX_OVERLAP;
        }
        const bottomOverlap = b.y - maxY;
        if (bottomOverlap > 0) {
          b.vy -= boundaryImpulse(bottomOverlap, b.vy);
          if (bottomOverlap > BOUNDARY_MAX_OVERLAP) b.y = maxY + BOUNDARY_MAX_OVERLAP;
        }
      });

      // Written via the standalone `translate` property (not left/top).
      // left/top are layout properties — changing them on 13 elements every
      // single frame forces a full layout recalculation each frame, which
      // is exactly the kind of thing that produces a visible "buzz" in the
      // final render even though the underlying numbers (as sampled) are
      // perfectly smooth. `translate`, like `transform`, is compositor-only
      // — the browser can just re-position the already-painted layer.
      bubbles.forEach(b => {
        const el = bubbleElRefs.current[b.key];
        if (el) {
          el.style.translate = `${b.x}px ${b.y}px`;
        }
      });

      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <PageTransition>
      <section className="projects">
        <div className="projects__content">
          <div className="projects__filters">
            <SpecularButton
              size="sm"
              radius={999}
              autoAnimate={!activeTag}
              tint={!activeTag ? '#7fa8d9' : '#0f1626'}
              tintOpacity={!activeTag ? 0.22 : 0.55}
              textColor={!activeTag ? '#a9c6e8' : '#97a3b8'}
              lineColor={!activeTag ? '#a9c6e8' : '#7fa8d9'}
              baseColor={!activeTag ? '#7fa8d9' : '#1a2338'}
              onClick={() => setActiveTag(null)}
            >
              全部
            </SpecularButton>
            {TAGS.map(tag => {
              const isActiveTag = activeTag === tag;
              return (
                <SpecularButton
                  key={tag}
                  size="sm"
                  radius={999}
                  autoAnimate={isActiveTag}
                  tint={isActiveTag ? '#7fa8d9' : '#0f1626'}
                  tintOpacity={isActiveTag ? 0.22 : 0.55}
                  textColor={isActiveTag ? '#a9c6e8' : '#97a3b8'}
                  lineColor={isActiveTag ? '#a9c6e8' : '#7fa8d9'}
                  baseColor={isActiveTag ? '#7fa8d9' : '#1a2338'}
                  onClick={() => setActiveTag(prev => (prev === tag ? null : tag))}
                >
                  {tag}
                </SpecularButton>
              );
            })}
          </div>

          <div
            className="projects__wall"
            ref={wallRef}
            onClick={e => {
              if (e.target === e.currentTarget) setActiveKey(null);
            }}
          >
            {PROJECTS.map(project => {
              const isActive = activeKey === project.key;
              const dimmed = !isActive && isDimmed(project.key);
              return (
                <div
                  key={project.key}
                  ref={el => {
                    bubbleElRefs.current[project.key] = el;
                    if (el && !el.style.translate) {
                      const seed = INITIAL_BY_KEY[project.key];
                      el.style.translate = `${seed.x}px ${seed.y}px`;
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isActive}
                  className={`project-bubble ${isActive ? 'is-active' : ''} ${dimmed ? 'is-dimmed' : ''}`}
                  style={isActive ? undefined : { '--size': `${sizeFor(project.key, project.name)}px` }}
                  onClick={() => setActiveKey(prev => (prev === project.key ? null : project.key))}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveKey(prev => (prev === project.key ? null : project.key));
                    }
                  }}
                >
                  {project.strong && !isActive && <span className="project-bubble__badge" />}
                  <AnimatePresence mode="wait" initial={false}>
                    {isActive ? (
                      <motion.div
                        key="detail"
                        className="project-bubble__detail"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.2, duration: 0.3 } }}
                        exit={{ opacity: 0, transition: { duration: 0.12 } }}
                      >
                        <button
                          type="button"
                          className="project-bubble__close"
                          onClick={e => {
                            e.stopPropagation();
                            setActiveKey(null);
                          }}
                          aria-label="关闭"
                        >
                          ×
                        </button>
                        <div className="project-bubble__top">
                          {project.strong && <span className="project-card__badge">代表项目</span>}
                          <span className="project-card__duration">{project.duration}</span>
                        </div>
                        <h2 className="project-bubble__title">{project.name}</h2>
                        <p className="project-bubble__role">{project.role}</p>
                        <div className="project-card__tags">
                          {project.tags.map(tag => (
                            <span key={tag} className="project-card__tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p className="project-bubble__summary">{project.summary}</p>
                      </motion.div>
                    ) : (
                      <motion.span
                        key="name"
                        className="project-bubble__name"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.15, duration: 0.25 } }}
                        exit={{ opacity: 0, transition: { duration: 0.1 } }}
                      >
                        {project.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Projects;
