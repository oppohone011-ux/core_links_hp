import { client } from "@/libs/client";
import Link from "next/link";
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const category = await client.get({ endpoint: "categories", contentId: id });
  return { title: `${category.name} | コアリンクス Studio` };
}

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await client.get({ endpoint: "categories", contentId: id });
  const blogs = await client.get({
    endpoint: "blogs",
    queries: { filters: `category[equals]${id}`, limit: 100 },
  });

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#1a1a1a', padding: '60px 20px' }}>
      <main style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* カテゴリー見出し */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
            <div style={{ width: '40px', height: '4px', backgroundColor: '#3b82f6' }}></div>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#3b82f6', letterSpacing: '0.2em' }}>CATEGORY</span>
          </div>
          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: '900', 
            color: '#111',
            lineHeight: '1.2',
            margin: 0
          }}>
            {category.name} <span style={{ color: '#facc15', WebkitTextStroke: '1px #ca8a04' }}>の一覧</span>
          </h1>
        </div>

        {/* 記事リスト */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {blogs.contents.map((blog: any) => {
            const date = new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

            return (
              <Link 
                key={blog.id} 
                href={`/blog/${blog.id}`} 
                className="blog-card"
                style={{ 
                  textDecoration: 'none',
                  display: 'block',
                  backgroundColor: '#fff',
                  padding: '25px',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>{date}</span>
                    <span style={{ height: '1px', flexGrow: 1, backgroundColor: '#f3f4f6' }}></span>
                  </div>
                  <h2 style={{ fontSize: '22px', color: '#111827', fontWeight: '800', lineHeight: '1.4', margin: 0 }}>
                    {blog.title}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#3b82f6', fontWeight: '700', fontSize: '14px' }}>
                    READ MORE <span style={{ marginLeft: '5px' }}>→</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* 記事がない場合 */}
        {blogs.contents.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', border: '2px dashed #e5e7eb', borderRadius: '20px' }}>
            <p style={{ fontSize: '16px', color: '#9ca3af', fontWeight: '600' }}>まだ記事が投稿されていません。</p>
          </div>
        )}
        
        {/* ホームへ戻るボタン：面白い動きを追加 */}
        <div style={{ marginTop: '80px', textAlign: 'center' }}>
          <Link href="/" style={{ 
            display: 'inline-block',
            padding: '20px 50px',
            backgroundColor: '#facc15', // 黄色
            color: '#000',
            borderRadius: '12px', // 少し角を丸く
            textDecoration: 'none',
            fontSize: '18px',
            fontWeight: '900',
            border: '3px solid #000', // 黒い太枠（アメコミ風）
            boxShadow: '6px 6px 0 #000', // 黒い影（アメコミ風）
            transition: 'all 0.15s ease-out',
            position: 'relative',
            overflow: 'hidden',
          }}
          className="back-home-btn"
          >
            ← BACK TO HOME
          </Link>
        </div>
      </main>

      {/* 面白い動き（アニメーション）用のCSS */}
      <style>{`
        /* 記事カードのホバー（既存） */
        .blog-card:hover {
          transform: translateY(-5px);
          border-color: #3b82f6;
          box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.15);
        }

        /* バックとぅホーもボタンのホバー：面白い動き */
        .back-home-btn:hover {
          /* 1. 少し拡大してネオンっぽく光る */
          transform: scale(1.05) translateY(-2px);
          background-color: #ffe033; /* 少し明るい黄色 */
          border-color: #3b82f6; /* 青い枠に変わる（ネオン発光） */
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.7), 0 0 30px rgba(59, 130, 246, 0.5); /* 青いネオン光 */
          color: #000;
          
          /* 2. ブルブル震えるアニメーション（高火力） */
          animation: highPowerVibration 0.3s ease-in-out infinite;
        }

        /* 高火力バイブレーションのアニメーション定義 */
        @keyframes highPowerVibration {
          0% { transform: scale(1.05) translateY(-2px) rotate(0deg); }
          25% { transform: scale(1.05) translateY(-2px) rotate(1deg); }
          50% { transform: scale(1.05) translateY(-2px) rotate(0deg); }
          75% { transform: scale(1.05) translateY(-2px) rotate(-1deg); }
          100% { transform: scale(1.05) translateY(-2px) rotate(0deg); }
        }

        /* クリック（アクティブ）時の挙動：影をなくして沈ませる */
        .back-home-btn:active {
          transform: scale(1.0) translateY(4px);
          box-shadow: none;
          animation: none; /* 震えを止める */
        }
      `}</style>
    </div>
  );
}