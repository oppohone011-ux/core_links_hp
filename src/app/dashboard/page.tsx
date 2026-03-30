"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FaTasks, FaWallet, FaSyncAlt, FaCog, 
  FaChevronRight, FaShieldAlt, FaMicrophone,
  FaCalculator, FaChartLine, FaStore // 新規アイコン
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
    { id: 3, title: "禁煙バイオモニター", description: "健康回復度と節約資金の監視", path: "/kinen-savings", icon: <FaShieldAlt />, color: "#00ffaa" },
    { id: 4, title: "収入管理 (バイト/FL)", description: "時給計算とフリーランス報酬の記録", path: "/income-work", icon: <FaCalculator />, color: "#48BB78" },
    { id: 5, title: "事業収益分析", description: "中長期的な事業売上と利益の可視化", path: "/business-revenue", icon: <FaChartLine />, color: "#805AD5" },
    { id: 6, title: "支出・サブスク", description: "支払い管理と固定費の最適化", path: "/payments", icon: <FaSyncAlt />, color: "#ED8936" },
    { id: 7, title: "案件・マーケット", description: "外部プラットフォームのトレンド分析", path: "/market-mining", icon: <FaStore />, color: "#F56565" },
    { id: 8, title: "設定", description: "アカウントとアプリの基本設定", path: "/settings", icon: <FaCog />, color: "#718096" },
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