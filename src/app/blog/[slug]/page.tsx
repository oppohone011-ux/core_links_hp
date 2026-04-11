import { client } from "@/libs/client";
import styles from "./Blog.module.css";
import Link from "next/link";

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await client.get({
    endpoint: "blogs",
    contentId: slug,
  });

  if (!post) return <div className={styles.articleWrapper}>記事が見つかりません</div>;

  return (
    <div className={styles.articleWrapper}>
      <header className={styles.articleHeader}>
        <div className={styles.headerInner}>
          <span className={styles.categoryTag}>直感の、その先を見届けるブログ</span>
          <h1 className={styles.articleTitle}>{post.title}</h1>
          
          <div className={styles.articleDate}>
            {new Date(post.publishedAt || post.createdAt).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'short',
            })}
          </div>
        </div>
      </header>

      <main className={styles.articleMain}>
        {post.eyecatch && (
          <img src={post.eyecatch.url} alt="" className={styles.eyecatchFull} />
        )}
        
        <article 
          className={styles.contentBody}
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />

        {/* --- プロフィールエリア：CSS Modules化 --- */}
        <hr className={styles.profileDivider} />
        <div className={styles.profileCard}>
          <span className={styles.writerBadge}>WRITER</span>
          <h3 className={styles.profileName}>HIDE</h3>
          
          <div className={styles.profileDescription}>
            <p className={styles.profileStatus}>
              CORELINKS（2026年7月くらいに法人化したい）。
            </p>
            <p className={styles.profileCareer}>
              日雇い、公務員、世界万博接客、EC運営、システム開発。
              フリマのスクレイピング開発、測量現場や製造工場の業務システム開発、ECマーケツール開発、FXの自動売買ツールの開発などなど。
            </p>
            <p className={styles.profileMotto}>
              「自分がおもしろい」と思ったロジックを形にしているだけの実装ログ。
            </p>
          </div>
          
          <div className={styles.profileBtnWrapper}>
            <Link href="/about" className={styles.profileDetailBtn}>
              やったこと一覧 →
            </Link>
          </div>
        </div>

        <div className={styles.backBtnWrapper}>
          <Link href="/" className={styles.backBtn}>
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}