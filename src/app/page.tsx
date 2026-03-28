import { client } from "@/libs/client";
import styles from "./Home.module.css";
import Link from "next/link"; 
import type { Metadata } from 'next';
import AdminLink from "./AdminLink";

// --- SEO設定（Metadata） ---
export const metadata: Metadata = {
  metadataBase: new URL('https://core-links-hp.vercel.app'),
  // 「器用貧乏」を「マルチポテンシャル（多才）」と「実装（カタチにする力）」に変換
  title: '直感の実装録 | Corelinks Studio', 
  description: '現場のリアルからIT・システム開発まで。バラバラな経験を繋ぎ合わせ、高火力な仕組みへと昇華させるコアリンクス（Corelinks Studio）代表の思考と技術の記録。',
  keywords: ['コアリンクス', 'Corelinks Studio', '業務効率化', 'システム開発', '福岡県','佐賀県','唐津市','DX', 'マルチポテンシャル', '高火力'],
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
    title: '直感の実装録 | Corelinks Studio',
    description: '皿洗いからシステム開発まで。あらゆる経験を「高火力」な武器に変える、マルチポテンシャルな生存戦略。',
    siteName: '直感の実装録',
    images: [{ url: '/hed.gif' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '直感の実装録 | Corelinks Studio',
    images: ['/hed.gif'],
  },
};

export default async function Home() {
  const blogsData = await client.get({ 
    endpoint: "blogs",
    queries: { limit: 50 } 
  });
  const categoriesData = await client.get({ endpoint: "categories" });

  return (
    <div className="bg-white min-h-screen">
      {/* 1. ヘッダー：ハンバーガーメニュー対応 */}
<header className={styles.header}>
  <div className={styles.logo}>Corelinks Studio</div>

  {/* チェックボックス（隠し要素）とボタンを追加 */}
  <input type="checkbox" id="menu-toggle" className={styles.menuCheckbox} />
  <label htmlFor="menu-toggle" className={styles.menuBtn}>
    <span></span>
  </label>

  <nav className={styles.nav}>
    <ul>
      <li><Link href="/">Home</Link></li>
      <li><Link href="/about">About</Link></li>
      <li><Link href="/dx">DX</Link></li>
      <li><Link href="/contact">Contact</Link></li>
      <AdminLink /> {/* ←これに差し替える */}
    </ul>
  </nav>
</header>

      {/* 2. サイトタイトルエリア：画像に代わる「サイトの顔」 */}
      <section className={styles.heroSection}>
  <div className={styles.heroInner}>
    <p className={styles.subTitle}>
      {"Multi-Potential LIFE".split("").map((char, i) => (
        <span key={i} style={{ animationDelay: `${i * 0.05}s` }} className={styles.char}>
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </p>
    <h1 className={styles.mainTitle}>
  <span className={styles.line1}>直感の設計図</span>
</h1>
<div className={styles.heroLine}></div>
<div className={styles.heroLine}></div>
  </div>
</section>

      {/* 3. コンテンツエリア */}
      <main className={styles.container}>
        {/* セクションタイトル */}
        <h2 className={styles.sectionTitle}>INDEX</h2>
        
        <div className={styles.categoryGrid}>
          {categoriesData.contents.map((category: any, index: number) => {
            const filteredPosts = blogsData.contents
              .filter((post: any) => post.category?.id === category.id)
              .slice(0, 5);

            // カテゴリー画像設定
            let frontFileName = "default.png";
            let backFileName = "default-back.png";

            if (category.name === "IT現場実録日誌") {
              frontFileName = "it-genba.png";
              backFileName  = "it-genba-back.png";
            } else if (category.name === "物販日誌") {
              frontFileName = "buppan.png";
              backFileName  = "buppan-back.png";
            } else if (category.name === "EA開発記録" || category.name === "EA開発＿実践記録") {
              frontFileName = "ea-dev.png";
              backFileName  = "ea-dev-back.png";
            } else if (category.name === "FX_実践記") {
              frontFileName = "fx-real.png";
              backFileName  = "fx-real-back.png";
            } else if (category.name === "日銭稼ぎ（バイト）") {
              frontFileName = "arbeit.png";
              backFileName  = "arbeit-back.png";
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
                    <div className={styles.viewLabel}>View Posts</div>
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
                      <h4 className={styles.backHeading}>{category.name}</h4>
                      <ul className={styles.articleList}>
                        {filteredPosts.map((post: any) => (
                          <li key={post.id} className={styles.articleItem}>
                            <Link href={`/blog/${post.id}`}>
                              {post.title?.length > 35 ? post.title.substring(0, 35) + "..." : (post.title || "Untitled")}
                            </Link>
                          </li>
                        ))}
                        {filteredPosts.length === 0 && (
                           <li className={styles.articleItem}>まだ記事がありません。</li>
                        )}
                      </ul>
                      <Link href={`/category/${category.id}`} className={styles.allLink}>
                        View All
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* 4. フッター：余白とタイポグラフィで魅せる */}
      <footer className={styles.footer}>
        {/* 背景アニメーション用の要素を追加。これがないと動きません！ */}
        <div className={styles.footerAnimateBg}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>Corelinks Studio</div>
            <p className={styles.footerCatchphrase}>
              点と線を繋ぎ、高火力な未来を実装する。
            </p>
          </div>
          
          <div className={styles.footerLinks}>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/contact">Contact</Link>
            <a href="https://core-links-hp.vercel.app" target="_blank" rel="noopener noreferrer">Portfolio</a>
          </div>

          <div className={styles.footerBottom}>
            <p className={styles.copyright}>© 2026 Corelinks Studio. All Rights Reserved.</p>
          </div>
        </div>
        {/* 背景に薄く流れる装飾テキスト */}
        <div className={styles.footerBgText}>CORELINKS</div>
      </footer>
    </div>
  );
}