"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FaTasks, FaWallet, FaSyncAlt, FaCog, 
  FaChevronRight, FaShieldAlt, FaMicrophone 
} from "react-icons/fa";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  const [curTime, setCurTime] = useState(new Date());

  // 時計更新ロジック
  useEffect(() => {
    const timer = setInterval(() => setCurTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 日本語フォーマット
  const dateString = curTime.toLocaleDateString("ja-JP", {
    year: "numeric", month: "2-digit", day: "2-digit", weekday: "short",
  });
  const timeString = curTime.toLocaleTimeString("ja-JP", {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });

  const menuItems = [
    { id: 1, title: "タスクマネージャー", description: "ToDo管理やスケジュールの確認", path: "/db-test", icon: <FaTasks />, color: "#4A90E2" },
    { id: 2, title: "ぽけっとログ", description: "爆速音声入力で支出を記録", path: "/voice", icon: <FaMicrophone />, color: "#22c55e" },
    { id: 3, title: "禁煙バイオモニター", description: "健康回復度と節約資金のリアルタイム監視", path: "/kinen-savings", icon: <FaShieldAlt />, color: "#00ffaa" },
    { id: 4, title: "支払い管理", description: "総合的な支出管理と詳細分析", path: "/payments", icon: <FaWallet />, color: "#48BB78" },
    { id: 5, title: "サブスク管理", description: "継続サービスの支払いや解約を管理", path: "/subscriptions", icon: <FaSyncAlt />, color: "#ED8936" },
    { id: 6, title: "設定", description: "アカウントとアプリの基本設定", path: "/settings", icon: <FaCog />, color: "#718096" },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.brandSection}>
            <h1 className={styles.welcomeText}>CORELINKS</h1>
            <p className={styles.subText}>今、「この瞬間」を創る</p>
          </div>
          
          <div className={styles.dateTimeContainer}>
            <p className={styles.dateText}>{dateString}</p>
            <p className={styles.timeText}>{timeString}</p>
          </div>
        </div>
      </header>

      <nav className={styles.menuGrid}>
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
      </nav>
    </div>
  );
}