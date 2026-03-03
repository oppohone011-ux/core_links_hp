import { client } from "../libs/client";
import styles from "./Home.module.css";

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
          <h1>高火力・たたき上げマルチ技術</h1>
          <p>皿洗い、現場仕事から ITまで器用貧乏を突き詰めたら『高火力』になった。</p>
        </div>
      </div>

      {/* 3. ブログ記事一覧 */}
      <main className={styles.container}>
        <h2 className={styles.sectionTitle}>Latest News</h2>
        <div className={styles.grid}>
          {data.contents.map((post: any) => (
            <article key={post.id} className={styles.card}>
              {/* アイキャッチ画像があれば表示 */}
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
          ))}
        </div>
      </main>
    </div>
  );
}