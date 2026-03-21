"use client";
import Link from "next/link";
import styles from "./dashboard.module.css";
// FaChevronRight（右矢印アイコン）を追加で読み込み
import { FaTasks, FaWallet, FaChartBar, FaCog, FaChevronRight } from "react-icons/fa";

export default function DashboardPage() {
  const menuItems = [
    {
      id: 1,
      title: "タスクマネージャー",
      description: "ToDo管理やスケジュールの確認",
      path: "/db-test", // src/app/db-test/ に対応
      icon: <FaTasks />,
      color: "#4A90E2",
    },
    {
      id: 2,
      title: "支払い管理",
      description: "音声入力での支出管理と分析",
      path: "/payments", // src/app/payments/ に対応
      icon: <FaWallet />,
      color: "#48BB78",
    },
    {
      id: 3,
      title: "データ分析",
      description: "月ごとの統計レポートを表示",
      path: "/payments", // 暫定的に支払い管理へ
      icon: <FaChartBar />,
      color: "#ED8936",
    },
    {
      id: 4,
      title: "設定",
      description: "アカウントとアプリの基本設定",
      path: "/settings", // 今後作成する用
      icon: <FaCog />,
      color: "#718096",
    },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.welcomeText}>CORELINKS</h1>
        <p className={styles.subText}>直感的に形にしましょう。</p>
      </header>

      <div className={styles.menuGrid}>
        {menuItems.map((item) => (
          <Link href={item.path} key={item.id} className={styles.menuCard}>
            <div className={styles.iconWrapper} style={{ backgroundColor: item.color }}>
              {item.icon}
            </div>
            <div className={styles.cardInfo}>
              <h2 className={styles.cardTitle}>{item.title}</h2>
              <p className={styles.cardDesc}>{item.description}</p>
            </div>
            <div className={styles.arrowWrapper}>
              <FaChevronRight className={styles.arrowIcon} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}