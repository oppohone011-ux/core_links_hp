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
          <span className={styles.categoryTag}>器用ボンビーブログ</span>
          <h1 className={styles.articleTitle}>{post.title}</h1>
          <p style={{ color: '#94a3b8', marginTop: '2rem' }}>
            {new Date(post.publishedAt || post.createdAt).toLocaleDateString('ja-JP', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'short',
})}
          </p>
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

        <div style={{ textAlign: 'center' }}>
          <Link href="/" className={styles.backBtn}>
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}