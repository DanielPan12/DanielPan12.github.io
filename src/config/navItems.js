export const NAV_ITEMS = [
  { label: '首页', href: '/' },
  { label: '教育经历', href: '/education' },
  { label: '实习经历', href: '/experience' },
  { label: '项目经历', href: '/projects' },
  { label: '学生工作', href: '/campus' },
  { label: '个人风采', href: '/hobbies' }
];

export const navIndex = pathname => NAV_ITEMS.findIndex(item => item.href === pathname);
