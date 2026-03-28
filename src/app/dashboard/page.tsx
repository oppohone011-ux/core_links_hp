"use client";
import Link from "next/link";
import styles from "./dashboard.module.css";
// FaShieldAlt (禁煙用) を追加
import { FaTasks, FaWallet, FaSyncAlt, FaCog, FaChevronRight, FaShieldAlt } from "react-icons/fa";

export default function DashboardPage() {
  const menuItems = [
    {
      id: 1,
      title: "タスクマネージャー",
      description: "ToDo管理やスケジュールの確認",
      path: "/db-test",
      icon: <FaTasks />,
      color: "#4A90E2",
    },
    {
      id: 2,
      title: "支払い管理",
      description: "音声入力での支出管理と分析",
      path: "/payments",
      icon: <FaWallet />,
      color: "#48BB78",
    },
    {
      id: 3,
      title: "禁煙バイオモニター", // 新規追加
      description: "健康回復度と節約資金のリアルタイム監視",
      path: "/kinen-savings",
      icon: <FaShieldAlt />,
      color: "#00ffaa", // 禁煙アプリのメインカラーに合わせました
    },
    {
      id: 4,
      title: "サブスク管理",
      description: "継続サービスの支払いや解約を管理",
      path: "/subscriptions",
      icon: <FaSyncAlt />,
      color: "#ED8936",
    },
    {
      id: 5,
      title: "設定",
      description: "アカウントとアプリの基本設定",
      path: "/settings",
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