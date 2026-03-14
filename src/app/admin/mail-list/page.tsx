"use client";
import { useState, useEffect } from "react";
import styles from "../../contact/Contact.module.css"; // お問い合わせのスタイルを流用

export default function MailListManager() {
  const [emails, setEmails] = useState<{ id: string; email: string }[]>([]);
  const [newEmail, setNewEmail] = useState("");

  // TODO: ここでmicroCMSからリストを取得する関数を書く
  useEffect(() => {
    // fetchEmails();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.messageBox}>
        <p className={styles.coreLinksText}>CORE LINKS ADMIN</p>
        <h2 className={styles.mainTitle}>メール宛先管理</h2>
        <p className={styles.subTitle}>// TEAM MEMBER MANAGEMENT</p>
      </div>

      <div className={styles.formCard}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>追加するメールアドレス</label>
          <input 
            type="email" 
            className={styles.input} 
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="example@gmail.com"
          />
        </div>
        
        <button className={styles.submitBtn} style={{ height: "80px", opacity: 1, cursor: "pointer" }}>
          <div className={styles.submitBtnBg} style={{ transform: "translateY(0)" }} />
          <span className={styles.submitBtnText}>メンバーを追加</span>
        </button>

        <div className={styles.fullWidth}>
          <h3 className={styles.label} style={{ marginTop: "2rem" }}>現在の配信先リスト</h3>
          <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
            {/* ここに登録済みのアドレスを並べる */}
            <li style={{ padding: "10px", borderBottom: "2px solid #eee", display: "flex", justifyContent: "space-between", fontWeight: 900 }}>
              corelinks.info.contact@gmail.com (管理者)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}