import { client } from "@/libs/client";
import styles from "./Home.module.css";
import Link from "next/link"; 
import type { Metadata } from 'next';

// --- SEO設定（Metadata） ---
export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'), 
  title: '気づけば高火力 器用ボンビーブログ | コアリンクス Corelinks Studio',
  description: 'コアリンクス（Corelinks Studio）代表が送る、現場仕事からIT・システム開発までの記録。器用貧乏を突き詰めて「高火力」になった男の業務効率化ブログ。',
  keywords: ['コアリンクス', 'Corelinks Studio', '業務効率化', 'システム開発', '器用貧乏', '高火力'],
  icons: {
    icon: [
      { url: '/icons/favicon.ico?v=1' },
      { url: '/icons/favicon-96x96.png?v=1', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png?v=1' },
    ],
  },
  openGraph: {
    title: '気づけば高火力 器用ボンビーブログ | コアリンクス',
    description: '皿洗いからシステム開発まで。コアリンクスが提案する「高火力」なマルチポテンシャルへの道。',
    siteName: '気づけば高火力 器用ボンビーブログ',
    images: [{ url: '/hed.gif' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '気づけば高火力 器用ボンビーブログ | コアリンクス',
    images: ['/hed.gif'],
  },
};

export default async function Home() {
  const blogsData = await client.get({ endpoint: "blogs" });
  const categoriesData = await client.get({ endpoint: "categories" });

  return (
    <div className="bg-white min-h-screen">
      {/* 1. ヘッダー */}
      <header className={styles.header}>
        <div className={styles.logo}>Corelinks Studio</div>
        <nav className={styles.nav}>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Service</a></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </nav>
      </header>

      {/* 2. メインビジュアル */}
      <div className={styles.mainVisual}>
        <div className={styles.heroText}>
          <h1>高火力・たたき上げマルチポテンシャル</h1>
          <p className={styles.heroDescription}>
            <span className={styles.highlightBlue}>皿洗い、現場仕事</span>から 
            <span className={styles.highlightRed}>IT</span>まで
            器用貧乏を突き詰めたら『<span className={styles.highlightYellow}>高火力</span>』になった。
          </p>
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

      {/* 3. カテゴリータイル一覧 */}
      <main className={styles.container}>
        <h2 className={styles.sectionTitle}>Explore Categories</h2>
        <div className={styles.categoryGrid}>
          {categoriesData.contents.map((category: any, index: number) => {
            const filteredPosts = blogsData.contents
              .filter((post: any) => post.category?.id === category.id)
              .slice(0, 5);

            let frontFileName = "default.png";
            let backFileName = "default-back.png";

            if (category.name === "物販日誌") {
              frontFileName = "buppan.png";
              backFileName  = "buppan-back.png";
            } else if (category.name === "EA開発記録") {
              frontFileName = "ea-dev.png";
              backFileName  = "ea-dev-back.png";
            } else if (category.name === "FX_実践記") {
              frontFileName = "fx-real.png";
              backFileName  = "fx-real-back.png";
            } else if (category.name === "日銭稼ぎ（バイト）") {
              frontFileName = "arbeit.png";
              backFileName  = "arbeit-back.png";
            } else if (category.name === "EA開発＿実践記録") {
              frontFileName = "ea-dev.png";
              backFileName  = "ea-dev-back.png";
            } else if (category.name === "更新情報") {
              frontFileName = "news.png";
              backFileName  = "news-back.png";
            }

            const frontUrl = `/${frontFileName}`;
            const backUrl  = `/${backFileName}`;

            return (
              <div key={category.id} className={styles.categoryTile}>
                <div className={styles.tileInner}>
                  <div 
                    className={styles.tileFront}
                    style={{ backgroundImage: `url(${frontUrl})` }}
                  >
                    <div className={styles.tileOverlay} />
                    <span className={styles.tileNumber}>0{index + 1}</span>
                    <h3 className={styles.tileTitle}>{category.name}</h3>
                    <div className={styles.viewLabel}>View Posts →</div>
                  </div>

                  <div 
                    className={styles.tileBack}
                    style={{ 
                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url(${backUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className={styles.backContent} style={{ position: 'relative', zIndex: 2 }}>
                      <h4 className={styles.backHeading}>{category.name} の最新記事</h4>
                      <ul className={styles.articleList}>
                        {filteredPosts.map((post: any) => (
                          <li key={post.id} className={styles.articleItem}>
                            {/* ディレクトリ構成に合わせて、個別記事へのリンクを[id]で指定 */}
                            <Link href={`/blog/${post.id}`}>
                              {post.title.length > 35 ? post.title.substring(0, 35) + "..." : post.title}
                            </Link>
                          </li>
                        ))}
                        {filteredPosts.length === 0 && (
                           <li className={styles.articleItem}>まだ記事がありません。</li>
                        )}
                      </ul>
                      <Link href={`/category/${category.id}`} className={styles.allLink}>
                        View All →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* 4. フッター */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>© 2026 気づけば高火力 器用ボンビーブログ</p>
          <div className="mt-2">
            <Link href="/privacy" className="text-xs text-gray-500 hover:underline">
              プライバシーポリシー
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}