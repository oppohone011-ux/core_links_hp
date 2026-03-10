import Link from "next/link";
import styles from "../blog/[slug]/Blog.module.css"; // 既存のスタイルを再利用

export default function AboutPage() {
  return (
    <div className={styles.articleWrapper}>
      {/* ヘッダーエリア */}
      <header className={styles.articleHeader}>
        <div className={styles.headerInner}>
          <span className={styles.categoryTag}>高火力器用ボンビーブログ</span>
          <h1 className={styles.articleTitle}>ABOUT</h1>
        </div>
      </header>

      <main className={styles.articleMain}>
        <section className={styles.contentBody}>
          <h2>会社員、バイトでの「違和感」の正体</h2>
          <p>
            これまで、日雇い派遣、公務員、世界万博の接客、EC運営、そしてシステム開発と、いくつもの現場を渡り歩いてきた。
          </p>
          <p>
            そこでずっと感じていたのは、<strong>「既存の組織や人間関係に、自分のリズムがどうしても噛み合わない」</strong>という強烈な違和感でした。
          </p>
          <p>
            言葉を選ばずに言えば、思考を止めた集団の中に居続けることへの焦燥感。変な奴と足並みを揃えて働くことへの拒絶反応。
            「いつまでも、この場所に居ては、楽しい人生、喜び、達成、歓喜といった体験はできない」そう、わたしは、感じました。
          </p>
          <p>
            2026年7月の法人化は、キラキラした夢のためだけではなく。
            この自分が感じている違和感を整えることで自分がなにを感じるのか、<strong>「最終的には、自分の傘を持つことが大切」</strong>ということを私の場合は感じてます。
          </p>

          <h2>実装という生存戦略</h2>
          <p>
            組織には馴染めなかったが、<br />
            自分がおもしろいと思った仕組みを形にする。それが私の中での唯一の正解だとおもってます。
          </p>
          
          <ul>
            <li><strong>フリマのスクレイピング：</strong> 画面の裏側にあるデータを、どうやって効率よく引っこ抜くか。あのパズルを解く瞬間に救われてきた。</li>
            <li><strong>FX自動売買 (EA)：</strong> 1秒間に何度も計算を繰り返す数式。感情のないロジックだけで金が動く世界は、一番フェアだ。</li>
            <li><strong>現場の業務システム：</strong> 誰かの「面倒くさい」を、コード数行で無効化する。あの快感だけは、何物にも代えがたい。</li>
          </ul>

          <p style={{ marginTop: '3rem' }}>
            ここは、そんな「社会とのズレ」を抱えた僕が、実装を通して世界と繋がろうとした記録です。
          </p>
        </section>

        <div className={styles.backBtnWrapper}>
          <Link href="/" className={styles.backBtn}>
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}