import styles from './DX.module.css';

export default function DXPage() {
  return (
    <div className={styles.container}>
      {/* ヒーローセクション */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.badge}>CORE LINKS STUDIO</p>
          <h1 className={styles.mainTitle}>
            現場課題を「数分」に変える<br />
            <span className={styles.highlight}>次世代DX実装計画</span>
          </h1>
          <p className={styles.lead}>
            単なるツール導入から、判断を自動化する「自律化」へ。
            コアリンクスが提案する、自動化エンジニアリングの全貌。
          </p>
        </div>
      </section>

      {/* 定量的成果セクション */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.enTitle}>過去の実績や改善案件内容</span>
            自動化が生み出した定量的成果
          </h2>
          <div className={styles.resultGrid}>
            <div className={styles.resultCard}>
              <div className={styles.resultNum}>2<span>weeks</span> → min</div>
              <h3>半導体製造 月報作成</h3>
              <p>基幹システムからデータを自動抽出し、グラフ・分析テキストを自動生成。事務作業を数分へ短縮。</p>
            </div>
            <div className={styles.resultCard}>
              <div className={styles.resultNum}>90<span>%</span></div>
              <h3>測量・建設 写真管理</h3>
              <p>数千枚の現場写真を一括処理し、台帳への座標連動貼り付けまで自動化。工数を大幅削減。</p>
            </div>
            <div className={styles.resultCard}>
              <div className={styles.resultNum}>1<span>click</span></div>
              <h3>米国EC 競合分析</h3>
              <p>ライバルセラーの全データを自動巡回取得。数日間の手作業をワンクリックに集約。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 自律型思想セクション */}
      <section className={`${styles.section} ${styles.bgDark}`}>
        <div className={styles.inner}>
          <div className={styles.philosophyFlex}>
            <div className={styles.philosophyText}>
              <h2 className={styles.whiteTitle}>判断そのものを自動化する</h2>
              <p>
                リアルタイムデータに基づき「判断」そのものを自動化するロジックを構築。<br />
                勘と経験に依存したオペレーションから脱却し、利益率に直結するデータドリブン経営を実現します。
              </p>
            </div>
            <div className={styles.compareCard}>
              <div className={styles.compareItem}>
                <span className={styles.old}>従来のDX</span>
                <p>手作業をコードに置換する</p>
              </div>
              <div className={styles.arrow}>↓</div>
              <div className={styles.compareItemActive}>
                <span className={styles.new}>CORE LINKS</span>
                <p>システムが自己判断する</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ロードマップセクション */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.enTitle}>ROADMAP</span>
            自動化から自律化へ
          </h2>
          <div className={styles.roadmap}>
            <div className={styles.step}>
              <div className={styles.stepNum}>01</div>
              <h4>業務自動化</h4>
              <p>手作業の置換</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNum}>02</div>
              <h4>データ可視化</h4>
              <p>現場数値の把握</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNum}>03</div>
              <h4>自律型EA</h4>
              <p>システムの自己判断</p>
            </div>
            <div className={`${styles.step} ${styles.activeStep}`}>
              <div className={styles.stepNum}>04</div>
              <h4>内業ゼロ</h4>
              <p>完全自律のデータ経営</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}