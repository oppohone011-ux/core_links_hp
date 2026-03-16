import styles from "../blog/[slug]/Blog.module.css";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className={styles.articleWrapper}>
      {/* 挨拶ボックスだけに「面白い」動きを加える設定 */}
      <style dangerouslySetInnerHTML={{ __html: `
        .interactive-box {
          transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .interactive-box:hover {
          transform: translateY(-5px);
        }
      `}} />

      {/* ヘッダー部分は、他のブログと100%同じスタイルを適用 */}
      <header className={styles.articleHeader}>
        <div className={styles.headerInner}>
          <span className={styles.categoryTag}>LEGAL NOTES</span>
          {/* 他のブログ記事と統一されたデザイン。文字色やサイズもCSSに準拠 */}
          <h1 className={styles.articleTitle}>Privacy Policy</h1>
          <div className={styles.articleDate}>2026.03.17 UPDATE</div>
        </div>
      </header>

      <main className={styles.articleMain}>
        <div className={styles.contentBody}>
          
          {/* 挨拶ボックス：ここだけ Corelinks らしい「黒×白」の強いデザイン */}
          <div className="interactive-box" style={{ 
            padding: '2.5rem 2rem', 
            background: '#000', 
            color: '#fff', 
            border: '4px solid #000',
            boxShadow: '10px 10px 0 #cbd5e1',
            marginBottom: '4rem',
            lineHeight: '1.8',
            fontWeight: '900',
            letterSpacing: '0.05em',
            borderRadius: '2px',
            cursor: 'default'
          }}>
            当サイト（Corelinks）をご利用いただく皆さまへ。<br />
            私たちは、お預かりする情報を大切に扱い、透明性の高い運営を心がけています。
          </div>

          <h2>01. 個人情報の取り扱いについて</h2>
          <p>
            お問い合わせフォーム等を通じてお預かりしたお名前やメールアドレスは、ご質問への回答や必要な情報をご連絡するためにのみ利用します。あなたの承諾なく、第三者に情報を開示することはありません。
          </p>

          <h2>02. Cookie（クッキー）とアクセス解析</h2>
          <p>
            当サイトでは、より快適な閲覧体験を提供するためにCookieを使用しています。また、Googleアナリティクスを利用してトラフィックデータを収集していますが、これは匿名で収集されており、個人を特定するものではありません。
          </p>

          <h2>03. 広告の配信</h2>
          <p>
            一部のコンテンツにおいて広告を掲載する場合があります。これにより得られた収益は、サイトの維持・改善のために役立てられます。
          </p>

          <h2>04. 免責事項</h2>
          <p>
            当サイトに掲載されている情報は、可能な限り正確を期していますが、その内容の完全性を保証するものではありません。万が一、当サイトの情報を利用したことでトラブルが生じた場合、一切の責任を負いかねますのでご了承ください。
          </p>
        </div>

        <div className={styles.backBtnWrapper}>
          <Link href="/" className={styles.backBtn}>← TOPへ戻る</Link>
        </div>
      </main>
    </div>
  );
}