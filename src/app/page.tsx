import { client } from "@/libs/client";
import styles from "./Home.module.css";
import Link from "next/link"; 

export default async function Home() {
  const data = await client.get({ 
    endpoint: "blogs" 
  });

  return (
    <div className="bg-white min-h-screen">
      {/* 1. ヘッダー（メニュー） */}
      <header className={styles.header}>
        <div className={styles.logo}>Corelinks Studio</div>
        <nav className={styles.nav}>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Service</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </nav>
      </header>

      {/* 2. ヘッダー画像（メインビジュアル） */}
      <div className={styles.mainVisual}>
        <div className={styles.heroText}>
          <h1>高火力・たたき上げスキル</h1>

          <p className={styles.heroDescription}>
            <span className={styles.highlightBlue}>皿洗い、現場仕事</span>から 
            <span className={styles.highlightRed}>IT</span>まで
            器用貧乏を突き詰めたら『<span className={styles.highlightYellow}>高火力</span>』になった。
          </p>
          
          {/* 実績タグをすべて投入！ */}
          <div className={styles.statsContainer}>
            <div className={styles.statTag}>EC会社RPA<br />システム作成</div>
            <div className={styles.statTag}>Amazon最高月収<br />250万(過去)</div>
            <div className={styles.statTag}>フリマ仕入<br />システム開発</div>
            <div className={styles.statTag}>FX自動売買<br />テスト運用中...</div>
            <div className={styles.statTag}>製造業<br />工程管理システム作成</div>
            <div className={styles.statTag}>ガテン系現場で<br />内業システム作成</div>
            <div className={styles.statTag}>その他多数<br />業務効率化...</div>
          </div>
        </div>
      </div>

      {/* 3. ブログ記事一覧 */}
      <main className={styles.container}>
        <h2 className={styles.sectionTitle}>気づけば高火力 器用ボンビーブログ</h2>
        <div className={styles.grid}>
          {data.contents.map((post: any) => (
            <Link href={`/blog/${post.id}`} key={post.id} className={styles.cardLink}>
              <article className={styles.card}>
                {post.eyecatch && (
                  <div className={styles.cardImage}>
                    <img src={post.eyecatch.url} alt="" />
                  </div>
                )}
                <div className={styles.cardContent}>
                  <h3 className={styles.articleTitle}>{post.title}</h3>
                  <div 
                    className={styles.excerpt}
                    dangerouslySetInnerHTML={{ __html: post.content.substring(0, 50) + "..." }} 
                  />
                </div>
              </article>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}