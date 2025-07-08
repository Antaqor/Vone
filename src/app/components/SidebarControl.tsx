'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function SidebarControl() {
  const pathname = usePathname();
  useEffect(() => {
    const left = document.getElementById('left-sidebar');
    const right = document.getElementById('right-sidebar');
    if (!left || !right) return;
    if (
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/classroom') ||
      pathname.startsWith('/login') ||
      pathname.startsWith('/register')
    ) {
      left.style.display = 'none';
      right.style.display = 'none';
    } else {
      left.style.display = '';
      right.style.display = '';
    }
    if (pathname.startsWith('/chat')) {
      right.style.display = 'none';
    }
  }, [pathname]);
  return null;
}
