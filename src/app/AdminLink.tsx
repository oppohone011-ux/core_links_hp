'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './Home.module.css';
import { Suspense } from 'react';

function AdminLinkContent() {
  const searchParams = useSearchParams();
  // URLの末尾が ?mode=admin の時だけ表示（合言葉は自由に変えてください）
  const isAdmin = searchParams.get('mode') === 'admin_core111';

  if (!isAdmin) return null;

  return (
    <li>
      <Link href="/login" className={styles.adminLink}>
        Dashboard
      </Link>
    </li>
  );
}

// next/navigation の useSearchParams を使う場合は Suspense で囲むのが推奨されます
export default function AdminLink() {
  return (
    <Suspense fallback={null}>
      <AdminLinkContent />
    </Suspense>
  );
}