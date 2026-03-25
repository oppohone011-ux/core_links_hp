'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './Home.module.css';
import { Suspense, useEffect, useState } from 'react';

function AdminLinkContent() {
  const searchParams = useSearchParams();
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    // 1. URLに合言葉があるかチェック
    const isUrlAdmin = searchParams.get('mode') === 'admin_core111';
    
    // 2. ブラウザのメモリに「管理者フラグ」があるかチェック
    const isStoredAdmin = localStorage.getItem('is_blog_admin') === 'true';

    if (isUrlAdmin) {
      // 合言葉があれば、ブラウザに保存して表示する
      localStorage.setItem('is_blog_admin', 'true');
      setShowDashboard(true);
    } else if (isStoredAdmin) {
      // 合言葉がなくても、過去に保存されていれば表示する
      setShowDashboard(true);
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