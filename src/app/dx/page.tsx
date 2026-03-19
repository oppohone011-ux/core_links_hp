import styles from './DX.module.css';

export default function DXPage() {
  return (
    <main className={styles.githubTheme}>
      {/* 01. REPO HEADER: ロゴを CORELINKS-Hub へ */}
      <header className={styles.repoHeader}>
        <div className={styles.container}>
          <div className={styles.headerTop}>
            <div className={styles.repoTitle}>
              <div className={styles.logoWrapper}>
                <svg width="24" height="24" viewBox="0 0 16 16" version="1.1" aria-hidden="true" className={styles.logoIcon}>
                  <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                </svg>
                <span className={styles.hubTitle}>CLS-Hub</span>
              </div>
              <span className={styles.separator}>/</span>
              <span className={styles.repo}>agressive-dx-protocol-v15</span>
              <span className={styles.badge}>Public</span>
            </div>
            <div className={styles.repoActions}>
              <div className={styles.actionBtn}>Star <span>20y_Field</span></div>
              <div className={styles.actionBtn}>Fork <span>Hyper_Automation</span></div>
            </div>
          </div>
        </div>
        <div className={styles.tabs}>
          <div className={styles.container}>
            <span className={`${styles.tab} ${styles.active}`}>Code</span>
            <span className={styles.tab}>Issues <span className={styles.tabCounter}>12k</span></span>
            <span className={styles.tab}>Pull requests <span className={styles.tabCounter}>Automation</span></span>
            <span className={styles.tab}>Actions</span>
          </div>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.mainGrid}>
          {/* LEFT: CONTENT (README & FILE) */}
          <div className={styles.contentCol}>
            <div className={styles.fileExplorer}>
              <div className={styles.fileHeader}>
                <div className={styles.authorInfo}>
                  <strong>CORELINKS-Architect</strong> committed <span className={styles.time}>20 years of expertise</span>
                </div>
                <div className={styles.commitMessage}>Merge FX-EA, Field-DX, and AI-scoring engine</div>
              </div>
              <div className={styles.fileList}>
                <div className={styles.fileRow}><span>src/ai/scoring-engine.ts</span><span>// Form data auto-ranking system (Node.js)</span></div>
                <div className={styles.fileRow}><span>src/automation/fx-ea.mq4</span><span>// High-speed trading logic (MQL)</span></div>
                <div className={styles.fileRow}><span>src/field/video-analysis.py</span><span>// Motion tracking & skill digitization</span></div>
                <div className={styles.fileRow}><span>docs/dx-manifesto.md</span><span>// Initial commit: "内業ゼロ"ビジョン</span></div>
              </div>
            </div>

            {/* README SECTION: 内容を厚く、熱く */}
            <div className={styles.readme}>
              <div className={styles.readmeHeader}>README.md</div>
              <article className={styles.readmeBody}>
                <h1>現場が終われば、仕事も終わり。</h1>
                <p className={styles.intro}>
                  自衛隊での規律、ドバイ万博での国際経験、EC運営、そして自動車・半導体工場の品質管理。
                  20年に及ぶ泥臭い現場経験とエンジニアリングを統合。
                  私の使命は、最高の職人が深夜まで強いられる「事務作業（内業）」という不条理を、
                  最新のWeb技術とAIで抹消し、真の直帰を実現することです。
                </p>

                <h2>🚀 最新技術スタック & AI実装</h2>
                <div className={styles.stackTable}>
                  <p><strong>Frontend/Backend:</strong> Node.js, Next.js 15, Vercel, microCMS</p>
                  <p><strong>AI Implementation:</strong> OpenAI連携による入力フォームデータのAIスコアリング（自動評価・ランク付け）</p>
                  <p><strong>Infrastructure/Databases:</strong> Supabase, Firebase, GitHub Action(CI/CD), GA4</p>
                </div>

                <h2>🔥 主要な開発実績と解決した課題（IMPACT）</h2>
                
                {/* Case 01: 製造・DX */}
                <div className={styles.caseCard}>
                  <span className={styles.caseNum}>01</span>
                  <h3>製造・半導体：スキルの「見える化」と単純作業の抹消</h3>
                  <ul>
                    <li><strong>動画分析ツール:</strong> 作業員の動きをPythonで測定・可視化。工程間の移動時間を算出し、言語化不能な技能をデジタル化。</li>
                    <li><strong>月報作成自動化:</strong> パワポ資料（グラフ・コメント入力）を Power BI 連携でワンポチ自動生成。</li>
                  </ul>
                  <code>IMPACT: 2週間の単純作業を数分へ短縮</code>
                </div>

                {/* Case 02: 測量・建設（キラー実績追加） */}
                <div className={styles.caseCard}>
                  <span className={styles.caseNum}>02</span>
                  <h3>測量・建設：帰社後の「内業」をゼロに</h3>
                  <ul>
                    <li><strong>測量自動写真差替・リネームツール [2025.12]:</strong> 数千枚の写真管理・整理（リネーム、配置調整）をPythonで自動化。</li>
                    <li><strong>次世代構想:</strong> タブレットでの撮影と資料作成を完全同期。帰社した瞬間に納品資料を完成させる。</li>
                  </ul>
                  <code>IMPACT: 写真管理工数を90%削減</code>
                </div>

                {/* Case 03: EC・金融（キラー実績追加） */}
                <div className={styles.caseCard}>
                  <span className={styles.caseNum}>03</span>
                  <h3>ビジネス自動化：グローバルEC & 金融EA</h3>
                  <ul>
                    <li><strong>フリマイニング開発 [2025.07]:</strong> Playwrightによる高速スクレイピング。仕入れ判断（期待値・回転率）を自動データ化。</li>
                    <li><strong>FX自動売買 EAツール開発 [2026.01]:</strong> リアルタイムデータ解析に基づく高精度なトレード自動化。</li>
                  </ul>
                  <code>IMPACT: 仕入れ・投資判断の単純労働を「ゼロ」へ</code>
                </div>

                <h2>📜 プロジェクト・ログ（歩んできた道）</h2>
                <div className={styles.timeline}>
                  {/* --- [最新] 2025 - 2026: 自動化・EA・測量DX --- */}
                  <div className={`${styles.timeItem} ${styles.latest}`}>
                    <span className={styles.timeTag}>2025 - 2026 (Accelerating)</span>
                    <div className={styles.timeContent}>
                      <p><strong>Next-Gen Automation Architect:</strong></p>
                      <ul className={styles.logUpdateList}>
                        <li><strong>[2026.01] FX自動売買 EAツール開発:</strong> リアルタイム解析による高精度トレード自動化ロジックの構築。</li>
                        <li><strong>[2025.12] 測量DX業務委託:</strong> 測量写真の自動差替・リネームツール開発。数千枚規模の「内業」をワンクリック化し工数90%削減。</li>
                        <li><strong>[2025.07] フリマイニング開発:</strong> 高速スクレイピングによる仕入判断ツール。期待値を算出し物販を「投資」へ昇華。</li>
                      </ul>
                    </div>
                  </div>

                  {/* --- 2021 - 2024: モダンDX --- */}
                  <div className={styles.timeItem}>
                    <span className={styles.timeTag}>2021 - 2024</span>
                    <p><strong>RPA & Web Engineer / DX Architect:</strong> 2021年より、米国EC市場の巨大プラットフォームを標的とした高度なRPAスイートの独自開発による事業オートメーションの完遂、およびPython（コンピュータビジョン）を用いた現場動線の精密解析による熟練技能の数値化・暗黙知の可視化に従事し、実力主義の現場において圧倒的な生産性向上を実現。</p>
                  </div>

                  {/* --- 2016 - 2020: グローバル & EC --- */}
                  <div className={styles.timeItem}>
                    <span className={styles.timeTag}>2016 - 2020</span>
                    <p><strong>Global & EC Business:</strong> 2016年より中東ドバイにて世界万博スタッフに従事。パレードや「なぎなたショー」への出演を通じ、アジア文化のプレゼンテーターとして国際的な発信活動を展開。
帰国後は個人事業主としてEC事業を本格化。2015年からのキャリアを背景に、最高月商250万円を達成。その翌月には独自のノウハウを体系化し、物販コンサルティング・セミナーを開始するなど、事業の立ち上げから教育までを一貫して遂行。現在は、培った物販知見をベースに「仕入れの自動化」を自社開発し、徹底した効率化を追求している。</p>
                  </div>

                  {/* --- 2011 - 2015: 規律 & 自衛隊 --- */}
                  <div className={styles.timeItem}>
                    <span className={styles.timeTag}>2011 - 2015</span>
                    <p><strong>JSDF (自衛隊):</strong> 陸上自衛隊にて車両・武器等の高精密整備に従事し、極限状態での規律と「停止を許されないシステム」の保守概念を徹底。その卓越したデジタル・リテラシーが司令部の目に留まり、異例の抜擢により西部方面隊の主要車両や部隊を象徴するタクティカル・ロゴのデザイン・編集を一任される。若手隊員ながら、伝統ある組織のビジュアルを再構築した功績が認められ、「優秀隊員」としてその多才な技術貢献を公式に表彰。</p>
                  </div>

                  {/* --- 2005 - 2010: 原点 & 品質管理 --- */}
                  <div className={styles.timeItem}>
                    <span className={styles.timeTag}>2005 - 2010</span>
                    <p><strong>Quality Assurance (自動車会社/自動車照明会社):</strong> 自自動車・部品製造の最前線において品質管理に従事。19歳でExcel VBAを用いた測定データ分析システムを独学で構築したのを皮切りに、自動車照明メーカーでは製造現場のデジタル化を一任。製品図上の座標データから「段差・隙間」の規格判定をオブジェクト描画で可視化する独自のEAシステムを開発。さらに、Accessを用いた不良品動態管理システムや、過去の不具合対応を即座にエビデンスとして抽出できるナレッジ共有データベースを自ら構築。現場の不条理をロジックで解決する「現場DX」の基盤を、この時期に確立。</p>
                  </div>
                </div>
              </article>
            </div>
          </div>

          {/* RIGHT: SIDEBAR */}
          <aside className={styles.sideCol}>
            {/* プロフィールセクションを追加 */}
            <div className={styles.profileBlock}>
              <div className={styles.avatarWrapper}>
                <img src="/HIDE.png" alt="古川 秀幸" className={styles.avatar} />
              </div>
              <div className={styles.profileInfo}>
                <h3 className={styles.profileName}>Hide</h3>
                <p className={styles.profileId}>CORELINKS-Architect</p>
                <p className={styles.profileBio}>
                  20 years in Field & Code. <br />
                  JSDF Veteran | Automation Designer
                </p>
                <button className={styles.followBtn}>Follow</button>
              </div>
            </div>

            <div className={styles.sideBlock}>
              <h3>Core Domain</h3>
              <p className={styles.domainTag}>Field-First DX</p>
              <p className={styles.domainTag}>AI-Scoring</p>
              <p className={styles.domainTag}>Hyper-Automation</p>
            </div>
            
            <div className={styles.sideBlock}>
              <h3>Experience Distribution</h3>
              <div className={styles.langBar}>
                <span className={styles.langField} style={{width: '40%'}} title="Field Ops" />
                <span className={styles.langTs} style={{width: '35%'}} title="Next.js/TS" />
                <span className={styles.langPy} style={{width: '25%'}} title="Python/AI" />
              </div>
              <ul className={styles.langList}>
                <li><span className={styles.dotField}>●</span> Field Ops & AppSheet (45%)</li>
                <li><span className={styles.dotTs}>●</span> Full-Stack (Next.js/TS) (30%)</li>
                <li><span className={styles.dotPy}>●</span> Algorithm & EA (25%)</li>
              </ul>
            </div>
            
            <div className={styles.sideBlock}>
              <h3>Special Skills</h3>
              <ul className={styles.skillList}>
                <li>JSDF Discipline (自衛隊仕込みの完遂能力)</li>
                <li>High-Speed Prototyping (飽きる前に形にする爆速実装)</li>
                <li>Problem-Solving Agility (課題解決の機動力)</li>
                <li>Daily Global Sync (英語による即時情報収集)</li>
                <li>Aesthetic UI/UX Design (現場の美学)</li>
                <li>Strategic Risk Management (FX/EAロジック)</li>
                <li>Legacy-to-Modern Bridge (既存Excelのアプリ化)</li>
                <li>Rapid Prototyping (現場での即日実装力)</li>
                <li>Mission Critical Thinking (24h稼働の設計思想)</li>
                <li>Field-Driven Development (現場第一の現場実装)</li>
                <li>Data-Centric Automation (データに基づく自動化)</li>
                <li>Adaptive Problem Solving (不測の事態への適応力)</li>
                <li>Global Market Awareness (グローバル市場の動向把握)</li>
                <li>Zero-Waste Process Design (無駄を削ぎ落とす工程設計)</li>
                <li>Continuous Iteration (止まらない改善サイクル)</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}