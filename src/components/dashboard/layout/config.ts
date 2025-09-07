import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'home', title: 'หน้าหลัก', href: paths.dashboard.main, icon: 'chart-pie' },
   {
    key: 'users',
    title: 'ผู้ใช้งาน',
    icon: 'users',
    items: [
      { key: 'users-all',     title: 'ผู้ใช้งานทั้งหมด',  href: paths.dashboard.usersAll,     icon: 'user-list',
        matcher: { type: 'startsWith', href: paths.dashboard.usersAll } },
      { key: 'users-pending', title: 'ผู้ใช้งานรออนุมัติ', href: paths.dashboard.usersPending, icon: 'user-clock' },
    ],
  },
  
  // { key: 'customers', title: 'ผู้ใช้งาน', href: paths.dashboard.customers, icon: 'users' },
  { key: 'integrations', title: 'ระบบในองค์กร', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  { key: 'settings', title: 'ตั้งค่า', href: paths.dashboard.settings, icon: 'gear-six' },
  // { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
