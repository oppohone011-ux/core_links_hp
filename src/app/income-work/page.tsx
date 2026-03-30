"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  FaChevronLeft, FaPlus, FaSpinner, FaTimes, FaTrashAlt, FaCheckCircle, FaRegCircle 
} from "react-icons/fa";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import { supabase } from "@/libs/supabase";
import styles from "./income.module.css";

interface IncomeRecord {
  id: string;
  date: string;
  type: string;
  title: string;
  company_name: string | null;
  amount: number;
  hourly_rate?: number | null;
  work_hours?: number | null;
  memo: string | null;
  is_completed: boolean; // ★追加
}

export default function IncomeWorkPage() {
  const [mounted, setMounted] = useState(false);
  const [records, setRecords] = useState<IncomeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialForm = {
    date: new Date().toISOString().split('T')[0],
    type: "バイト",
    company_name: "",
    title: "",
    amount: "",
    hourlyRate: "",
    hours: "",
    memo: "",
    is_completed: false // ★追加
  };
  
  const [formData, setFormData] = useState(initialForm);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("income_records")
        .select("*")
        .order("date", { ascending: false })
        .limit(50);
      if (error) throw error;
      if (data) setRecords(data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchRecords();
  }, []);

  // ステータス更新（チェックボックス用）
  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("income_records")
        .update({ is_completed: !currentStatus })
        .eq("id", id);
      if (error) throw error;
      // ローカルの状態を更新
      setRecords(records.map(r => r.id === id ? { ...r, is_completed: !currentStatus } : r));
    } catch (err) {
      console.error("Status Update Error:", err);
    }
  };

  // 時給計算
  useEffect(() => {
    if (formData.type === "バイト" && formData.hourlyRate && formData.hours) {
      const calc = Math.floor(Number(formData.hourlyRate) * Number(formData.hours));
      setFormData(prev => ({ ...prev, amount: calc.toString() }));
    }
  }, [formData.hourlyRate, formData.hours, formData.type]);

  // 集計
  const stats = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const filtered = records.filter(r => {
      const d = new Date(r.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const fl = filtered.filter(r => r.type === "案件").reduce((s, r) => s + r.amount, 0);
    const part = filtered.filter(r => r.type === "バイト").reduce((s, r) => s + r.amount, 0);

    const chart = [...records].reverse().slice(-10).map(r => ({
      name: r.date.split('-').slice(1).join('/'),
      "フリーランス": r.type === "案件" ? r.amount : 0,
      "バイト": r.type === "バイト" ? r.amount : 0,
    }));

    return { total: fl + part, fl, part, chart };
  }, [records]);

  const handleEdit = (record: IncomeRecord) => {
    setEditingId(record.id);
    setFormData({
      date: record.date,
      type: record.type,
      company_name: record.company_name || "",
      title: record.title,
      amount: record.amount.toString(),
      hourlyRate: record.hourly_rate?.toString() || "",
      hours: record.work_hours?.toString() || "",
      memo: record.memo || "",
      is_completed: record.is_completed // ★追加
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!editingId) return;
    if (!confirm("この記録を削除しますか？")) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("income_records").delete().eq("id", editingId);
      if (error) throw error;
      setShowModal(false);
      setEditingId(null);
      fetchRecords();
    } catch (err) {
      alert("削除に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return alert("ログインが必要です");

      const payload = {
        user_id: session.user.id,
        date: formData.date,
        type: formData.type,
        company_name: formData.company_name,
        title: formData.title,
        amount: Number(formData.amount),
        hourly_rate: formData.type === "バイト" ? Number(formData.hourlyRate) : null,
        work_hours: formData.type === "バイト" ? Number(formData.hours) : null,
        memo: formData.memo,
        is_completed: formData.is_completed // ★追加
      };

      if (editingId) {
        const { error } = await supabase.from("income_records").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("income_records").insert([payload]);
        if (error) throw error;
      }

      setShowModal(false);
      setEditingId(null);
      setFormData(initialForm);
      fetchRecords(); 
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openNewModal = () => {
    setEditingId(null);
    setFormData(initialForm);
    setShowModal(true);
  };

  if (!mounted) return null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>収入管理・分析</h1>
        <Link href="/dashboard" className={styles.backLink}>
          <FaChevronLeft size={14} />
          <span className={styles.backText}>戻る</span>
        </Link>
      </header>

      <div className={styles.main}>
        {/* サマリーカード */}
        <div className={styles.summaryGrid}>
          <div className={`${styles.card} ${styles.totalCard}`}>
            <span className={styles.cardLabel}>今月の合計収入</span>
            <span className={styles.cardAmount}>¥{stats.total.toLocaleString()}</span>
          </div>
          <div className={`${styles.card} ${styles.flCard}`}>
            <span className={styles.cardLabel}>フリーランス案件</span>
            <span className={styles.cardAmount}>¥{stats.fl.toLocaleString()}</span>
          </div>
          <div className={`${styles.card} ${styles.partCard}`}>
            <span className={styles.cardLabel}>バイト給与</span>
            <span className={styles.cardAmount}>¥{stats.part.toLocaleString()}</span>
          </div>
        </div>

        {/* グラフ */}
        <section className={styles.chartSection}>
          <h3 className={styles.sectionTitle}>収益の内訳推移</h3>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `¥${v/1000}k`} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                <Legend iconType="circle" wrapperStyle={{fontSize: '12px', paddingTop: '10px'}} />
                <Bar dataKey="フリーランス" stackId="a" fill="#3b82f6" />
                <Bar dataKey="バイト" stackId="a" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <div className={styles.buttonGrid}>
          <button className={styles.primaryBtn} onClick={openNewModal}>
            <FaPlus /> 収入を記録
          </button>
        </div>

        <section className={styles.listSection}>
          <h3 className={styles.sectionTitle}>最近の記録（ダブルクリックで編集）</h3>
          {loading ? (
            <div className={styles.loading}><FaSpinner className={styles.spin} /></div>
          ) : (
            <div className={styles.list}>
              {records.map((record) => (
                <div 
                  key={record.id} 
                  className={`
                    ${styles.listItem} 
                    ${record.type === "案件" ? styles.listItemFreelance : styles.listItemPartTime}
                    ${record.is_completed ? styles.completed : ''}
                  `} 
                  onDoubleClick={() => handleEdit(record)}
                >
                  {/* ステータスチェックボタン */}
                  <div className={styles.statusToggle} onClick={() => toggleStatus(record.id, record.is_completed)}>
                    {record.is_completed ? <FaCheckCircle color="#10b981" size={20} /> : <FaRegCircle color="#cbd5e1" size={20} />}
                  </div>

                  <div className={styles.itemInfo}>
                    <div className={styles.itemTitle}>
                      {record.title}
                      {record.company_name && <span className={styles.companyBadge}>{record.company_name}</span>}
                      <span className={`${styles.statusBadge} ${record.is_completed ? styles.statusDone : styles.statusPending}`}>
                        {record.is_completed ? "完了" : "未完了"}
                      </span>
                    </div>
                    <p className={styles.itemDate}>{record.date}</p>
                    {record.memo && <p className={styles.itemMemo}>{record.memo}</p>}
                  </div>
                  <div className={styles.itemValue}>
                    <p className={styles.itemPrice}>+¥{record.amount.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{editingId ? "記録を編集" : "新規入力"}</h2>
              <button onClick={() => setShowModal(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* ステータス切替（編集時のみ） */}
              <div className={styles.formGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="checkbox" 
                  id="status"
                  checked={formData.is_completed} 
                  onChange={e => setFormData({...formData, is_completed: e.target.checked})} 
                />
                <label htmlFor="status" style={{ marginBottom: 0 }}>完了としてマーク</label>
              </div>

              <div className={styles.formGroup}>
                <label>日付</label>
                <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div className={styles.formGroup}>
                <label>カテゴリー</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="バイト">バイト (時給計算)</option>
                  <option value="案件">FL案件 / 事業</option>
                  <option value="その他">その他</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>会社名 / 支払元</label>
                <input type="text" value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} placeholder="例: 株式会社〇〇" />
              </div>
              <div className={styles.formGroup}>
                <label>内容 / 現場名</label>
                <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="例: 現場A" />
              </div>
              {formData.type === "バイト" && (
                <div className={styles.row}>
                  <div className={styles.formGroup}>
                    <label>時給</label>
                    <input type="number" value={formData.hourlyRate} onChange={e => setFormData({...formData, hourlyRate: e.target.value})} placeholder="1200" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>時間</label>
                    <input type="number" step="0.1" value={formData.hours} onChange={e => setFormData({...formData, hours: e.target.value})} placeholder="8" />
                  </div>
                </div>
              )}
              <div className={styles.formGroup}>
                <label>合計金額 (¥)</label>
                <input type="number" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
              </div>
              
              <div className={styles.formGroup}>
                <label>メモ</label>
                <textarea 
                  value={formData.memo} 
                  onChange={e => setFormData({...formData, memo: e.target.value})} 
                  placeholder="特記事項や備考など"
                  rows={3}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                {editingId && (
                  <button 
                    type="button" 
                    onClick={handleDelete} 
                    className={styles.deleteBtn}
                  >
                    <FaTrashAlt /> 削除
                  </button>
                )}
                <button type="submit" disabled={isSubmitting} className={styles.submitBtn} style={{ flex: 2 }}>
                  {isSubmitting ? "保存中..." : (editingId ? "更新する" : "保存する")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}