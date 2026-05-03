"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  FaChevronLeft, FaPlus, FaSpinner, FaTimes, FaTrashAlt, FaCheckCircle, 
  FaRegCircle, FaWallet, FaChartPie, FaCalendarAlt, FaBuilding, FaClock, FaStickyNote
} from "react-icons/fa";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
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
  start_time?: string | null;
  end_time?: string | null;
  break_minutes?: number | null;
  transport_fees?: number | null;
  memo: string | null;
  is_completed: boolean;
}

export default function IncomeWorkPage() {
  const [mounted, setMounted] = useState(false);
  const [records, setRecords] = useState<IncomeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewDate, setViewDate] = useState(new Date());

  const initialForm = {
    date: new Date().toISOString().split('T')[0],
    type: "バイト",
    company_name: "",
    title: "",
    amount: "",
    hourlyRate: "",
    hours: "",
    startTime: "",
    endTime: "",
    breakMinutes: "0",
    transportFees: "0",
    memo: "",
    is_completed: false
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

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("income_records")
        .update({ is_completed: !currentStatus })
        .eq("id", id);
      if (error) throw error;
      setRecords(records.map(r => r.id === id ? { ...r, is_completed: !currentStatus } : r));
    } catch (err) {
      console.error("Status Update Error:", err);
    }
  };

  // 自動計算ロジック
  useEffect(() => {
    if (formData.type === "バイト" && formData.hourlyRate && formData.startTime && formData.endTime) {
      const [sH, sM] = formData.startTime.split(':').map(Number);
      const [eH, eM] = formData.endTime.split(':').map(Number);
      const startTotal = sH * 60 + sM;
      const endTotal = eH * 60 + eM;
      const breakMin = Number(formData.breakMinutes) || 0;
      const diffMin = endTotal - startTotal - breakMin;
      const workHours = diffMin / 60;

      if (workHours > 0) {
        const wage = Math.floor(Number(formData.hourlyRate) * workHours);
        const total = wage + (Number(formData.transportFees) || 0);
        setFormData(prev => ({ 
          ...prev, 
          hours: workHours.toFixed(2), 
          amount: total.toString() 
        }));
      }
    }
  }, [formData.hourlyRate, formData.startTime, formData.endTime, formData.breakMinutes, formData.transportFees, formData.type]);

  const stats = useMemo(() => {
    const targetMonth = viewDate.getMonth();
    const targetYear = viewDate.getFullYear();

    const filtered = records.filter((r) => {
      const d = new Date(r.date);
      return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
    });

    // 各種別の集計
    const fl = filtered
      .filter((r) => r.type === "案件")
      .reduce((s, r) => s + r.amount, 0);
    const part = filtered
      .filter((r) => r.type === "バイト")
      .reduce((s, r) => s + r.amount, 0);
    const other = filtered
      .filter((r) => r.type !== "案件" && r.type !== "バイト")
      .reduce((s, r) => s + r.amount, 0);

    return {
      total: fl + part + other,
      fl,
      part,
      other,
      chartData: [
        { name: "案件", value: fl, color: "#3b82f6" },
        { name: "バイト", value: part, color: "#8b5cf6" },
        { name: "その他", value: other, color: "#94a3b8" },
      ].filter((d) => d.value > 0),
    };
  }, [records, viewDate]);

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
      startTime: record.start_time || "",
      endTime: record.end_time || "",
      breakMinutes: record.break_minutes?.toString() || "0",
      transportFees: record.transport_fees?.toString() || "0",
      memo: record.memo || "",
      is_completed: record.is_completed
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!editingId || !confirm("この記録を削除しますか？")) return;
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
        start_time: formData.type === "バイト" ? formData.startTime : null,
        end_time: formData.type === "バイト" ? formData.endTime : null,
        break_minutes: formData.type === "バイト" ? Number(formData.breakMinutes) : null,
        transport_fees: formData.type === "バイト" ? Number(formData.transportFees) : null,
        memo: formData.memo,
        is_completed: formData.is_completed
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

  if (!mounted) return null;

 return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>収入管理・分析</h1>
        <Link href="/dashboard" className={styles.backLink}>
          <FaChevronLeft size={14} /> <span>戻る</span>
        </Link>
      </header>

      <div className={styles.main}>
        
        {/* --- ここから追加：月切り替えコントローラー --- */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '16px',
          padding: '12px 16px',
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <button type="button" onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
            <FaChevronLeft />
          </button>
          <div style={{ fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaCalendarAlt color="#64748b" />
            {viewDate.getFullYear()}年 {viewDate.getMonth() + 1}月
          </div>
          <button type="button" onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
            <FaChevronLeft style={{ transform: 'rotate(180deg)' }} />
          </button>
        </div>
        {/* --- ここまで追加 --- */}

        {/* サマリー */}
        <div className={styles.summaryGrid}>
          <div className={`${styles.card} ${styles.totalCard}`}>
            <span className={styles.cardLabel}>{viewDate.getMonth() + 1}月の合計</span>
            <span className={styles.cardAmount}>¥{stats.total.toLocaleString()}</span>
          </div>
          <div className={`${styles.card} ${styles.flCard}`}>
            <span className={styles.cardLabel}>案件</span>
            <span className={styles.cardAmount}>¥{stats.fl.toLocaleString()}</span>
          </div>
          <div className={`${styles.card} ${styles.partCard}`}>
            <span className={styles.cardLabel}>バイト</span>
            <span className={styles.cardAmount}>¥{stats.part.toLocaleString()}</span>
          </div>
          {/* ↓ これを追加 */}
          <div className={`${styles.card} ${styles.otherCard}`} style={{ background: '#64748b', color: '#fff' }}>
            <span className={styles.cardLabel}>その他</span>
            <span className={styles.cardAmount}>¥{stats.other.toLocaleString()}</span>
          </div>
        </div>

        {/* グラフセクション */}
        <div className={styles.chartSection}>
          <span className={styles.sectionTitle}><FaChartPie /> 収入比率分析</span>
          <div style={{ width: '100%', height: '180px' }}>
            {stats.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.chartData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                今月のデータがありません
              </div>
            )}
          </div>
        </div>

        <button className={styles.primaryBtn} onClick={() => { setEditingId(null); setFormData(initialForm); setShowModal(true); }}>
          <FaPlus /> 収入を記録する
        </button>

        {/* 履歴リスト */}
        <section className={styles.listSection} style={{ marginTop: '24px' }}>
          <h3 className={styles.sectionTitle}>最近の記録</h3>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}><FaSpinner className={styles.spin} /></div>
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
                  <div className={styles.statusToggle} onClick={() => toggleStatus(record.id, record.is_completed)}>
                    {record.is_completed ? <FaCheckCircle color="#10b981" size={22} /> : <FaRegCircle color="#cbd5e1" size={22} />}
                  </div>

                  <div className={styles.itemInfo}>
                    <div className={styles.itemTitle}>
                      {record.title}
                      {record.company_name && <span className={styles.companyBadge}>{record.company_name}</span>}
                    </div>
                    <div className={styles.itemDate}>
                      <FaCalendarAlt size={10} /> {record.date} 
                      {record.start_time && <span><FaClock size={10} style={{marginLeft: '8px'}} /> {record.start_time}〜</span>}
                    </div>
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

      {/* モーダル */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900 }}>{editingId ? "記録の編集" : "新規入力"}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><FaTimes size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup} style={{ background: '#f8fafc', padding: '12px', borderRadius: '16px', flexDirection: 'row', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setFormData({...formData, is_completed: !formData.is_completed})}>
                {formData.is_completed ? <FaCheckCircle color="#10b981" size={20} /> : <FaRegCircle color="#cbd5e1" size={20} />}
                <label style={{ marginBottom: 0, cursor: 'pointer' }}>完了としてマークする</label>
              </div>

              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label><FaCalendarAlt /> 日付</label>
                  <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label>種別</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="バイト">バイト</option>
                    <option value="案件">FL案件</option>
                    <option value="その他">その他</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label><FaBuilding /> 会社名 / クライアント</label>
                <input type="text" value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} placeholder="CORE LINKS 案件など" />
              </div>

              <div className={styles.formGroup}>
                <label>内容 / 業務名</label>
                <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="現場作業・開発など" />
              </div>

              {formData.type === "バイト" && (
                <div style={{ background: '#f1f5f9', padding: '16px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className={styles.row}>
                    <div className={styles.formGroup}><label>開始</label><input type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} /></div>
                    <div className={styles.formGroup}><label>終了</label><input type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} /></div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.formGroup}><label>休憩(分)</label><input type="number" value={formData.breakMinutes} onChange={e => setFormData({...formData, breakMinutes: e.target.value})} /></div>
                    <div className={styles.formGroup}><label>交通費</label><input type="number" value={formData.transportFees} onChange={e => setFormData({...formData, transportFees: e.target.value})} /></div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.formGroup}><label>時給</label><input type="number" value={formData.hourlyRate} onChange={e => setFormData({...formData, hourlyRate: e.target.value})} /></div>
                    <div className={styles.formGroup}><label>稼働時間</label><input type="text" readOnly value={formData.hours} className={styles.readOnlyInput} /></div>
                  </div>
                </div>
              )}

              <div className={styles.formGroup} style={{ marginTop: '10px' }}>
                <label style={{ color: '#059669', fontSize: '1rem' }}><FaWallet /> 合計金額 (¥)</label>
                <input 
                  type="number" required 
                  style={{ fontSize: '1.5rem', height: '60px', borderColor: '#10b981' }}
                  value={formData.amount} 
                  onChange={e => setFormData({...formData, amount: e.target.value})} 
                />
              </div>

              <div className={styles.formGroup}>
                <label><FaStickyNote /> メモ</label>
                <textarea value={formData.memo} onChange={e => setFormData({...formData, memo: e.target.value})} rows={2} />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                {editingId && (
                  <button type="button" onClick={handleDelete} className={styles.deleteBtn} style={{ width: '60px' }}>
                    <FaTrashAlt />
                  </button>
                )}
                <button type="submit" disabled={isSubmitting} className={styles.submitBtn} style={{ flex: 1 }}>
                  {isSubmitting ? "保存中..." : (editingId ? "更新する" : "記録を保存")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}