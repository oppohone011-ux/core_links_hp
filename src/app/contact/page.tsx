"use client";
import styles from "./Contact.module.css";

export default function ContactForm() {
  return (
    <div className={styles.container}>
      <div className={styles.messageBox}>
        <p className={styles.coreLinksText}>CORE LINKS</p>
        <h2 className={styles.mainTitle}>お問い合わせ</h2>
        <p className={styles.subTitle}>// OFFICIAL CONTACT FORM</p>
      </div>

      <form className={styles.formCard} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>01. お名前 / 会社名</label>
          <input type="text" className={styles.input} placeholder="株式会社〇〇 / 氏名" />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>02. メールアドレス</label>
          <input type="email" className={styles.input} placeholder="example@corelinks.studio" />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>03. ご相談の領域</label>
          <input type="text" className={styles.input} placeholder="RPA・自動化 / システム開発" />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>04. ご予算の目安</label>
          <input type="text" className={styles.input} placeholder="30万円〜 / 応相談" />
        </div>

        <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
          <label className={styles.label}>05. ご相談内容の詳細</label>
          <textarea rows={4} className={styles.textarea} placeholder="現状の課題や、実現したい野望を教えてください。" />
        </div>

        {/* メンテナンス中のため送信ボタンを無効化 */}
        <button type="button" disabled className={styles.submitBtn}>
          <div className={styles.submitBtnBg} />
          <span className={styles.submitBtnText}>現在メンテナンス中です ⚠️</span>
        </button>

        {/* ホームへ戻るための導線 */}
        <div className={styles.homeBackWrapper}>
          <a href="/" className={styles.homeBackBtn}>
            ← ホームへ戻る
          </a>
        </div>

        <div className={styles.footerText}>
          CORE LINKS STUDIO
        </div>
      </form>
    </div>
  );
}