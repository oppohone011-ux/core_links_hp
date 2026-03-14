"use client";
import { useState } from "react";
import styles from "./Contact.module.css";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // 送信処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      domain: formData.get("domain"),
      budget: formData.get("budget"),
      detail: formData.get("detail"),
    };

    try {
      // 🚀 本物のAPI（route.ts）を呼び出す
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('API送信エラー');
      }

      setIsSent(true);
    } catch (error) {
      console.error("送信エラー:", error);
      alert("AI門番への通信に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSent) {
    return (
      <div className={styles.container}>
        <div className={styles.formCard} style={{ textAlign: "center", padding: "8rem 2rem" }}>
          <h2 className={styles.mainTitle}>送信完了</h2>
          <p className={styles.subTitle}>// MISSION RECEIVED</p>
          <p style={{ fontWeight: 900, marginTop: "2rem" }}>
            AI門番が内容を確認しました。<br />
            あなたの「野望」は、現在運営チームに共有されています。
          </p>
          <div className={styles.homeBackWrapper}>
            <a href="/" className={styles.homeBackBtn}>← ホームへ戻る</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.messageBox}>
        <p className={styles.coreLinksText}>CORE LINKS</p>
        <h2 className={styles.mainTitle}>お問い合わせ</h2>
        <p className={styles.subTitle}>// OFFICIAL CONTACT FORM</p>
      </div>

      <form className={styles.formCard} onSubmit={handleSubmit}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>01. お名前 / 会社名</label>
          <input name="name" type="text" className={styles.input} placeholder="株式会社〇〇 / 氏名" required />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>02. メールアドレス</label>
          <input name="email" type="email" className={styles.input} placeholder="example@corelinks.studio" required />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>03. ご相談の領域</label>
          <input name="domain" type="text" className={styles.input} placeholder="RPA・自動化 / システム開発" />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>04. ご予算の目安</label>
          <input name="budget" type="text" className={styles.input} placeholder="30万円〜 / 応相談" />
        </div>

        <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
          <label className={styles.label}>05. ご相談内容の詳細</label>
          <textarea name="detail" rows={4} className={styles.textarea} placeholder="現状の課題や、実現したい野望を教えてください。" required />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting} 
          className={styles.submitBtn}
          style={{ 
            backgroundColor: isSubmitting ? "#666" : "#000",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            opacity: 1 
          }}
        >
          <div className={styles.submitBtnBg} style={{ transform: isSubmitting ? "translateY(0)" : "" }} />
          <span className={styles.submitBtnText}>
            {isSubmitting ? "門番が確認中..." : "野望を送信する"}
          </span>
        </button>

        <div className={styles.homeBackWrapper}>
          <a href="/" className={styles.homeBackBtn}>← ホームへ戻る</a>
        </div>

        <div className={styles.footerText}>CORE LINKS STUDIO</div>
      </form>
    </div>
  );
}