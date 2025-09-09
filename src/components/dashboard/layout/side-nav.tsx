'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowSquareUpRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowSquareUpRight';
import { ChevronDown } from 'lucide-react';

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { Logo } from '@/components/core/logo';
import * as Icons from "lucide-react";
import { navItems } from './config';
import { navIcons } from './nav-icons';
import Collapse from '@mui/material/Collapse';


export function SideNav(): React.JSX.Element {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        '--SideNav-background': 'var(--mui-palette-neutral-950)',
        '--SideNav-color': 'var(--mui-palette-common-white)',
        '--NavItem-color': 'var(--mui-palette-neutral-300)',
        '--NavItem-hover-background': 'rgba(255, 255, 255, 0.04)',
        '--NavItem-active-background': 'var(--mui-palette-primary-main)',
        '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
        '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
        '--NavItem-icon-color': 'var(--mui-palette-neutral-400)',
        '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
        '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-600)',
        bgcolor: 'var(--SideNav-background)',
        color: 'var(--SideNav-color)',
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        height: '100%',
        left: 0,
        maxWidth: '100%',
        position: 'fixed',
        scrollbarWidth: 'none',
        top: 0,
        width: 'var(--SideNav-width)',
        zIndex: 'var(--SideNav-zIndex)',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-flex',textDecoration: "none", // ❌ เอาเส้นใต้ลิงก์ออก
      color: "white",         }}>
          {/*<Logo color="light" height={32} width={122} />*/}
          <Icons.MonitorCog width={60} height={60} color="#ffffff" />
          <Typography variant="h6" sx={{ mt: 1, mb: 0,ml:1, fontSize: 18, fontWeight: 'bold' }}>
          ระบบอินทราเน็ต
          ภายในองค์กร
          </Typography>
          
        </Box>
     
          
      </Stack>
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
      <Box component="nav" sx={{ flex: '1 1 auto', p: '12px' }}>
        {renderNavItems({ pathname, items: navItems })}
      </Box>
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
      
    </Box>
  );
}

function renderNavItems({ items = [], pathname }: { items?: NavItemConfig[]; pathname: string }): React.JSX.Element {
  const children = items.reduce((acc: React.ReactNode[], curr: NavItemConfig): React.ReactNode[] => {
    const { key, ...item } = curr;

    acc.push(<NavItem key={key} pathname={pathname} {...item} />);

    return acc;
  }, []);

  return (
    <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {children}
    </Stack>
  );
}

interface NavItemProps extends Omit<NavItemConfig, 'items'> {
  pathname: string;
}

function NavItem({
  disabled,
  external,
  href,
  icon,
  matcher,
  pathname,
  title,
  items, 
}: NavItemConfig & { pathname: string }): React.JSX.Element {
  const active = isNavItemActive({ disabled, external, href, matcher, pathname });
  const Icon = icon ? navIcons[icon] : null;
  const childActive =
  Array.isArray(items) &&
  items.some((child) =>
    isNavItemActive({
      disabled: child.disabled,
      external: child.external,
      href: child.href,
      matcher: child.matcher,
      pathname,
    })
  );

// ถ้าเมนูนี้ active เอง หรือมีลูก active → เปิดไว้
const [open, setOpen] = React.useState(active || childActive);
  // มีเมนูย่อย
  if (items && items.length > 0) {
    return (
      <li>
        {/* ปุ่มเมนูหลัก */}
        <Box
          role="button"
          onClick={() => setOpen(!open)}
          sx={{
            alignItems: 'center',
            borderRadius: 1,
            color: 'var(--NavItem-color)',
            cursor: 'pointer',
            display: 'flex',
            gap: 1,
            p: '6px 16px',
            ...(active && {
              bgcolor: 'var(--NavItem-active-background)',
              color: 'var(--NavItem-active-color)',
            }),
          }}
        >
          {Icon && (
            <Icon
              fill={active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'}
              fontSize="var(--icon-fontSize-md)"
              weight={active ? 'fill' : undefined}
            />
          )}
          <Typography component="span" sx={{ flex: 1, fontSize: '0.875rem', fontWeight: 500 }}>
            {title}
          </Typography>
          <ChevronDown
            size={18}
            strokeWidth={2.5}
            style={{
              transition: 'transform 200ms ease',   // เวลา + easing
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)', // หมุน 180 องศา
          }}
          />

        </Box>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <Stack component="ul" spacing={0.5} sx={{ listStyle: 'none', pl: 4, mt: 0.5 }}>
                {items.map(({ key, ...child }: NavItemConfig) => (
                  <NavItem key={key} pathname={pathname} {...child} />
                 ))}
          </Stack>
        </Collapse> 
      </li>
    );
  }

  // ถ้าไม่มีเมนูย่อย → render ลิงก์ปกติ
  return (
    <li>
      <Box
        {...(href
          ? {
              component: external ? 'a' : RouterLink,
              href,
              target: external ? '_blank' : undefined,
              rel: external ? 'noreferrer' : undefined,
            }
          : { role: 'button' })}
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          color: 'var(--NavItem-color)',
          cursor: 'pointer',
          display: 'flex',
          gap: 1,
          p: '6px 16px',
          textDecoration: 'none',
          ...(disabled && {
            color: 'var(--NavItem-disabled-color)',
            cursor: 'not-allowed',
          }),
          ...(active && {
            bgcolor: 'var(--NavItem-active-background)',
            color: 'var(--NavItem-active-color)',
          }),
        }}
      >
        {Icon && (
          <Icon
            fill={active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'}
            fontSize="var(--icon-fontSize-md)"
            weight={active ? 'fill' : undefined}
          />
        )}
        <Typography component="span" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
          {title}
        </Typography>
      </Box>
    </li>
  );
}