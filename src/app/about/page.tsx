import Link from "next/link";
import blogStyles from "../blog/[slug]/Blog.module.css"; 
import styles from "./About.module.css"; // 新しく作成

export default function AboutPage() {
  return (
    <div className={blogStyles.articleWrapper}>
      <header className={blogStyles.articleHeader}>
        <div className={blogStyles.headerInner}>
          <span className={blogStyles.categoryTag}>MANIFESTO</span>
          <h1 className={styles.aboutTitle}>
            実装という、<br />ただひとつの生存戦略。
          </h1>
          <span className={styles.subTitle}>ABOUT THE AUTHOR / 2026.07 CORP. PENDING</span>
        </div>
      </header>

      <main className={blogStyles.articleMain}>
        <section className={blogStyles.contentBody}>
          
          <div className={styles.leadText}>
            「既存の組織や人間関係に、自分のリズムがどうしても噛み合わない」
          </div>

          <p>
            日雇い派遣、公務員、世界万博の接客、EC運営、そしてシステム開発。
            いくつもの現場を渡り歩いて確信したのは、思考を止めた集団の中に居続けることへの焦燥感でした。
          </p>
          
          <p>
            「いつまでも、この場所に居ては、楽しい人生、喜び、達成、歓喜といった体験はできない」
          </p>

          <div className={styles.statement}>
            2026年7月の法人化。それはキラキラした夢のためだけではなく、
            この違和感を整え、<strong>「自分の傘を持つ」</strong>という決意の表明です。
          </div>

          <hr className={styles.divider} />

          <h2>CORE STACK / 救いとしての実装</h2>
          <p>
            組織には馴染めなかったが、自分がおもしろいと思った仕組みを形にする。
            それだけが、私の中での唯一の正解でした。
          </p>
          
          <div className={styles.skillGrid}>
            <div className={styles.skillCard}>
              <h3>01. データ抽出のパズル</h3>
              <p>フリマのスクレイピング。画面の裏側にあるデータを効率よく引っこ抜く。あのパズルを解く瞬間に救われてきた。</p>
            </div>

            <div className={styles.skillCard}>
              <h3>02. 非情なまでのフェアネス</h3>
              <p>FX自動売買 (EA)。感情のないロジックだけで金が動く世界は、一番フェアだ。</p>
            </div>

            <div className={styles.skillCard}>
              <h3>03. 「面倒」の無効化</h3>
              <p>現場の業務システム。誰かの「面倒くさい」を、コード数行で無効化する。あの快感こそが原動力。</p>
            </div>

            <div className={styles.skillCard}>
              <h3>04. 高火力な個の生存戦略</h3>
              <p>2026年7月の法人化を見据え、自分のリズムを殺さずに戦うための仕組みを実装し続ける。ここは、そのための実験場だ。</p>
            </div>
          </div>

          <p className={styles.closing}>
            ここは、そんな「社会とのズレ」を抱えた私が、<br />
            実装を通して世界と繋がろうとした記録です。
          </p>
        </section>

        <div className={blogStyles.backBtnWrapper}>
          <Link href="/" className={blogStyles.backBtn}>
            ← RETURN TO INDEX
          </Link>
        </div>
      </main>
    </div>
  );
}