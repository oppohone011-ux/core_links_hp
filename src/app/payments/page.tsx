"use client";
import { useState, useEffect, useMemo } from "react";
import styles from "./payments.module.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function PaymentsPage() {
  const [status, setStatus] = useState("待機中");
  const [parsedList, setParsedList] = useState<any[]>([]);
  const [dbRecords, setDbRecords] = useState<any[]>([]);
  
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const fetchRecords = async () => {
    try {
      const res = await fetch("/api/payments?type=list");
      const result = await res.json();
      if (result.success) setDbRecords(result.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchRecords(); }, []);

  // --- 年間推移の集計 (修正版：完了・未完了の積み上げ) ---
  const yearlyData = useMemo(() => {
    const months = [];
    const currentYear = new Date().getFullYear(); 
    for (let i = 0; i < 12; i++) {
      const mStr = `${currentYear}-${String(i + 1).padStart(2, '0')}`;
      const monthlyRecords = dbRecords.filter(r => r.due_date && String(r.due_date).startsWith(mStr));
      
      // 完了済みの合計
      const completed = monthlyRecords
        .filter(r => r.is_completed)
        .reduce((sum, r) => sum + Number(r.amount || 0), 0);
      
      // 未完了の合計
      const pending = monthlyRecords
        .filter(r => !r.is_completed)
        .reduce((sum, r) => sum + Number(r.amount || 0), 0);

      months.push({
        name: `${i + 1}月`,
        completed: completed, // 完了
        pending: pending,     // 未完了
        total: completed + pending, // ツールチップ用
        fullMonth: mStr
      });
    }
    return months;
  }, [dbRecords]);

  // --- 統計計算ロジック ---
  const stats = useMemo(() => {
    const currentMonthData = dbRecords.filter(r => r.due_date && String(r.due_date).startsWith(selectedMonth));
    const total = currentMonthData.reduce((sum, r) => sum + Number(r.amount || 0), 0);

    const [year, month] = selectedMonth.split("-").map(Number);
    const lastMonthDate = new Date(year, month - 2, 1);
    const lastMonthStr = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;
    const lastMonthTotal = dbRecords
      .filter(r => r.due_date && String(r.due_date).startsWith(lastMonthStr))
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);

    const diff = total - lastMonthTotal;
    const diffPercent = lastMonthTotal > 0 ? Math.round((diff / lastMonthTotal) * 100) : (total > 0 ? 100 : 0);

    const breakdown = currentMonthData.reduce((acc: any, r) => {
      const type = r.payment_method || "未分類";
      acc[type] = (acc[type] || 0) + Number(r.amount || 0);
      return acc;
    }, {});

    return { total, diff, diffPercent, breakdown, count: currentMonthData.length };
  }, [dbRecords, selectedMonth]);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("ブラウザが非対応です。");
    const recognition = new SpeechRecognition();
    recognition.lang = "ja-JP";
    recognition.onstart = () => setStatus("🎤 聴き取り中...");
    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setStatus("🔄 解析中...");
      try {
        const res = await fetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: transcript }),
        });
        const result = await res.json();
        if (result.success) {
          setParsedList(prev => [result.data, ...prev]);
          setStatus("✅ 解析完了");
        }
      } catch (e) { setStatus("❌ 解析エラー"); }
    };
    recognition.start();
  };

  const handleDiscard = (index: number) => {
    setParsedList(prev => prev.filter((_, i) => i !== index));
    if (parsedList.length <= 1) setStatus("待機中");
  };

  const handleConfirm = async (index: number) => {
    const item = parsedList[index];
    setStatus("💾 保存中...");
    try {
      const dbPayload = {
        content: item.content,
        amount: Number(item.amount),
        due_date: item.due_date,
        payment_method: item.pay_type || "その他",
        bank_account: item.bank_name || "",
        is_completed: false,
        isConfirm: true
      };
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dbPayload),
      });
      if ((await res.json()).success) {
        setParsedList(prev => prev.filter((_, i) => i !== index));
        fetchRecords();
        setStatus("✅ 保存完了");
      }
    } catch (e) { setStatus("❌ 保存失敗"); }
  };

 // --- 更新処理（爆速版：楽観的更新） ---
  const handleUpdate = async (id: string, updatedData: any) => {
    // 【1】まず手元のデータを更新（これでグラフやリストが即座に動く）
    setDbRecords(prev => prev.map(rec => 
      rec.id === id ? { ...rec, ...updatedData, amount: Number(updatedData.amount) } : rec
    ));

    setStatus("🔄 更新中..."); 
    try {
      const res = await fetch("/api/payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id, 
          content: updatedData.content,
          amount: Number(updatedData.amount),
          due_date: updatedData.due_date,
          payment_method: updatedData.payment_method,
          bank_account: updatedData.bank_account,
          is_completed: updatedData.is_completed
        }),
      });

      const result = await res.json();
      if (result.success) {
        // 【2】成功時は fetchRecords() を呼ばない！
        setStatus("✅ 更新完了"); 
        setTimeout(() => setStatus("待機中"), 1500);
      } else {
        // 失敗した時だけDBから最新を取って戻す
        fetchRecords();
        setStatus("❌ 更新失敗");
      }
    } catch (e) { 
      fetchRecords();
      setStatus("❌ エラー");
    }
  };

  // --- 削除処理（爆速版：楽観的更新） ---
  const handleDelete = async (id: string) => {
    if (!confirm("削除しますか？")) return;

    // 【1】まず画面から消す（ユーザーを待たせない）
    setDbRecords(prev => prev.filter(rec => rec.id !== id));
    
    setStatus("🗑️ 削除中...");
    try {
      const res = await fetch(`/api/payments?id=${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        setStatus("✅ 削除完了");
        setTimeout(() => setStatus("待機中"), 1500);
      } else {
        // 失敗したら復活させる
        fetchRecords();
        alert("削除に失敗しました");
      }
    } catch (e) {
      fetchRecords();
      setStatus("❌ 削除失敗");
    }
  };

  // --- 修正点：入力中の値を即座にステートに反映させる ---
  const onDbFieldChange = (id: string, field: string, value: any) => {
    setDbRecords(prev => prev.map(rec => 
      rec.id === id ? { ...rec, [field]: value } : rec
    ));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>支払い管理</h1>
        <button onClick={startListening} className={styles.btnVoice}>音声入力をはじめる</button>
        <div className={styles.statusInfo}>{status}</div>
      </header>

      {parsedList.length > 0 && (
        <section className={styles.parsedSection}>
          <h2 className={styles.parsedTitle}>✨ 解析結果</h2>
          {parsedList.map((item, index) => (
            <div key={index} className={styles.parsedRow}>
              <div className={styles.parsedDetails}>
                <strong>内容:</strong> {item.content}<br/>
                <strong>金額:</strong> {Number(item.amount).toLocaleString()} 円<br/>
                <strong>期限:</strong> {item.due_date || "未設定"}
              </div>
              <div className={styles.parsedActions}>
                <button onClick={() => handleConfirm(index)} className={styles.btnConfirm}>DBに保存</button>
                <button onClick={() => handleDiscard(index)} className={styles.btnCancel}>キャンセル</button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* グラフセクション：テキストラベルを削除 */}
      <section className={styles.chartSection}>
        <h2 className={styles.sectionHeading}>📈 年間支払い推移</h2>
        <div style={{ width: '100%', height: 250, marginTop: '20px' }}>
          <ResponsiveContainer>
            <BarChart data={yearlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
              <Tooltip 
                cursor={{fill: '#f1f5f9'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value, name) => {
                  const label = name === "completed" ? "完了済み" : "未完了";
                  return [`${Number(value).toLocaleString()} 円`, label];
                }}
              />
              {/* 未完了（赤） */}
              <Bar dataKey="pending" stackId="a" fill="#f56565" radius={[4, 4, 0, 0]} />
              {/* 完了済み（緑） */}
              <Bar dataKey="completed" stackId="a" fill="#48bb78" radius={[0, 0, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* ここにあった凡例の div を削除しました */}
      </section>

      {/* レポート */}
      <section className={styles.reportSection}>
        <div className={styles.reportHeader}>
          <h2 className={styles.sectionHeading}>📊 月次レポート</h2>
          <input 
            type="month" 
            className={styles.monthInput}
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)} 
          />
        </div>
        
        <div className={styles.statsGrid}>
          <div className={styles.statsCard}>
            <span className={styles.label}>合計支出</span>
            <div className={styles.statsValue}>{stats.total.toLocaleString()}<span>円</span></div>
          </div>
          <div className={styles.statsCard}>
            <span className={styles.label}>前月比</span>
            <div className={`${styles.statsValue} ${stats.diff > 0 ? styles.trendUp : styles.trendDown}`}>
              {stats.diff > 0 ? "+" : ""}{stats.diff.toLocaleString()}
              <small>({stats.diffPercent}%)</small>
            </div>
          </div>
        </div>

        <div className={styles.breakdownBox}>
          <span className={styles.label}>支払い区分内訳</span>
          {Object.entries(stats.breakdown).map(([type, amount]) => (
            <div key={type} className={styles.breakdownRow}>
              <span>{String(type)}</span>
              <span>{Number(amount).toLocaleString()} 円</span>
            </div>
          ))}
          {stats.count === 0 && <div className={styles.noData}>データがありません</div>}
        </div>
      </section>

      {/* 支払いリスト */}
      <div className={styles.section}>
        <h2 className={styles.sectionHeading}>⏳ {selectedMonth.split("-")[1]}月の予定</h2>
        {dbRecords
          .filter(r => !r.is_completed && r.due_date?.startsWith(selectedMonth))
          .map(rec => (
            <PaymentCard key={rec.id} rec={rec} onUpdate={handleUpdate} onDelete={handleDelete} onFieldChange={onDbFieldChange} isPending />
          ))}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionHeading}>✅ 完了済み</h2>
        {dbRecords
          .filter(r => r.is_completed && r.due_date?.startsWith(selectedMonth))
          .map(rec => (
            <PaymentCard key={rec.id} rec={rec} onUpdate={handleUpdate} onDelete={handleDelete} onFieldChange={onDbFieldChange} />
          ))}
      </div>
    </div>
  );
}

function PaymentCard({ rec, onUpdate, onDelete, onFieldChange, isPending }: any) {
  return (
    <div className={`${styles.card} ${isPending ? styles.pendingCard : styles.completedCard}`}>
      <div className={styles.cardRow}>
        <label className={styles.label}>内容</label>
        <input className={styles.inputBase} value={rec.content} onChange={(e) => onFieldChange(rec.id, "content", e.target.value)} />
      </div>

      <div className={styles.grid2}>
        <div className={styles.cardRow}>
          <label className={styles.label}>金額 (円)</label>
          <input 
            className={styles.inputBase} 
            type="number" 
            value={rec.amount ?? ""} 
            onChange={(e) => onFieldChange(rec.id, "amount", e.target.value)} 
          />
        </div>
        <div className={styles.cardRow}>
          <label className={styles.label}>支払期限</label>
          <input className={styles.inputBase} type="date" value={rec.due_date || ""} onChange={(e) => onFieldChange(rec.id, "due_date", e.target.value)} />
        </div>
      </div>

      <div className={styles.grid2}>
        <div className={styles.cardRow}>
          <label className={styles.label}>支払い区分</label>
          <select 
            className={styles.inputBase} 
            value={rec.payment_method || ""} 
            onChange={(e) => onFieldChange(rec.id, "payment_method", e.target.value)}
          >
            <option value="">選択してください</option>
            <option value="振込用紙">振込用紙</option>
            <option value="引き落とし">引き落とし</option>
            <option value="振り込み">振り込み</option>
            <option value="その他">その他</option>
          </select>
        </div>
        <div className={styles.cardRow}>
          <label className={styles.label}>振り込み元</label>
          <input 
            className={styles.inputBase} 
            value={rec.bank_account || ""} 
            onChange={(e) => onFieldChange(rec.id, "bank_account", e.target.value)} 
          />
        </div>
      </div>

      <div className={styles.cardFooter}>
        <button 
          className={styles.btnStatus} 
          style={{ backgroundColor: rec.is_completed ? "#48bb78" : "#f56565" }}
          onClick={() => onUpdate(rec.id, { ...rec, is_completed: !rec.is_completed })}
        >
          {rec.is_completed ? "完了" : "未完了"}
        </button>
        <button className={styles.btnUpdate} onClick={() => onUpdate(rec.id, rec)}>更新</button>
        <button className={styles.btnDelete} onClick={() => onDelete(rec.id)}>削除</button>
      </div>
    </div>
  );
}