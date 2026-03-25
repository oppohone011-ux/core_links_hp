'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './Home.module.css';
import { Suspense, useEffect, useState } from 'react';

function AdminLinkContent() {
  const searchParams = useSearchParams();
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    // 1. URLのパラメータをチェック
    const mode = searchParams.get('mode');

    if (mode === 'admin_core111') {
      // 合言葉がある場合：管理者モードをONにして保存
      localStorage.setItem('is_blog_admin', 'true');
      setShowDashboard(true);
    } else if (mode === 'logout') {
      // 【追加】?mode=logout でアクセスすれば強制的に一般モードへ
      localStorage.removeItem('is_blog_admin');
      setShowDashboard(false);
    } else {
      // 合言葉がない場合：保存されているフラグに従う
      const isStoredAdmin = localStorage.getItem('is_blog_admin') === 'true';
      setShowDashboard(isStoredAdmin);
    }
  }, [searchParams]);

  if (!showDashboard) return null;

  return (
    <li>
      <Link href="/login" className={styles.adminLink}>
        Dashboard
      </Link>
    </li>
  );
}

export default function AdminLink() {
  return (
    <Suspense fallback={null}>
      <AdminLinkContent />
    </Suspense>
  );
}