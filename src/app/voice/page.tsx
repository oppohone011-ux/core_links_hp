"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { supabase } from "@/libs/supabase";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import styles from "./voice.module.css";

export default function VoiceInputPage() {
  const [isListening, setIsListening] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [barData, setBarData] = useState<any[]>([]); 
  const [weekData, setWeekData] = useState<any[]>([]); 
  const [pieData, setPieData] = useState<any[]>([]); 
  // 初期値を空文字で固定
  const [editData, setEditData] = useState({ location: "", item_name: "", amount: 0 });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempEdit, setTempEdit] = useState<any>(null);

  const fetchData = async () => {
    const { data: logData } = await supabase.from("payment_logs").select("*").order("created_at", { ascending: false }).limit(50);
    if (logData) setLogs(logData);

    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const { data: totalData } = await supabase.from("payment_logs").select("amount, item_name, created_at").gte("created_at", firstDay);
    
    if (totalData) {
      setMonthlyTotal(totalData.reduce((acc, cur) => acc + (cur.amount || 0), 0));
      
      const dayMap = totalData.reduce((acc: any, cur) => {
        const d = new Date(cur.created_at).getDate();
        acc[d] = (acc[d] || 0) + (cur.amount || 0);
        return acc;
      }, {});
      setBarData(Object.keys(dayMap).map(d => ({ 日付: `${d}日`, 金額: dayMap[d] })).sort((a,b) => parseInt(a.日付) - parseInt(b.日付)).slice(-7));

      const weeklyMap = totalData.reduce((acc: any, cur) => {
        const w = getWeekNumber(new Date(cur.created_at));
        acc[w] = (acc[w] || 0) + (cur.amount || 0);
        return acc;
      }, {});
      setWeekData(Object.keys(weeklyMap).map(w => ({ 週: `第${w}週`, 金額: weeklyMap[w] })));

      let waste = 0; let spending = 0;
      totalData.forEach(item => {
        if (item.item_name && item.item_name.match(/(スロット|パチンコ|負け|ギャンブル)/)) waste += (item.amount || 0);
        else spending += (item.amount || 0);
      });
      setPieData([{ name: '生活・消費', value: spending, color: '#22c55e' }, { name: '浪費・投資', value: waste, color: '#ff7675' }]);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const getWeekNumber = (date: Date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = "ja-JP";
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      const amount = text.match(/(\d+)/) ? parseInt(text.match(/(\d+)/)[0]) : 0;
      setEditData({ ...editData, item_name: text.replace(/\d+円?/, "").trim(), amount: amount });
      setIsListening(false);
    };
    recognition.start();
  };

  const handleSave = async () => {
    if (!editData.item_name || !editData.amount) return;
    await supabase.from("payment_logs").insert([editData]);
    fetchData();
    setEditData({ location: "", item_name: "", amount: 0 });
  };

  const startEdit = (log: any) => {
    setEditingId(log.id);
    const date = new Date(log.created_at);
    const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    // 全ての項目に || "" を適用して null を防ぐ
    setTempEdit({ 
      ...log, 
      location: log.location || "", 
      item_name: log.item_name || "", 
      created_at: localDateTime 
    });
  };

  const handleUpdate = async () => {
    if (!tempEdit || !tempEdit.item_name || !tempEdit.amount) return;
    const { id, ...updateData } = tempEdit;
    await supabase.from("payment_logs").update({
      ...updateData,
      created_at: new Date(tempEdit.created_at).toISOString()
    }).eq("id", id);
    setEditingId(null);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("このデータを削除してもよろしいですか？")) return;
    await supabase.from("payment_logs").delete().eq("id", id);
    setEditingId(null);
    fetchData();
  };

  const renderHistoryWithWeeklySubtotal = () => {
    let lastWeek = -1;
    let weeklySum = 0;
    const elements: ReactNode[] = [];

    logs.forEach((log, index) => {
      const date = new Date(log.created_at);
      const currentWeek = getWeekNumber(date);

      if (lastWeek !== -1 && lastWeek !== currentWeek) {
        elements.push(
          <div key={`subtotal-${index}`} className={styles.weeklyDivider}>
            <span>1週間の小計</span>
            <span className={styles.weeklyAmount}>¥{weeklySum.toLocaleString()}</span>
          </div>
        );
        weeklySum = 0;
      }
      weeklySum += (log.amount || 0);
      lastWeek = currentWeek;

      const isEditing = editingId === log.id;

      elements.push(
        <div 
          key={log.id} 
          className={`${styles.historyItem} ${isEditing ? styles.itemEditing : ""}`}
          onDoubleClick={() => !isEditing && startEdit(log)}
        >
          {isEditing && tempEdit ? (
            <div className={styles.editForm}>
              <div className={styles.editInputs}>
                <input 
                  type="datetime-local" 
                  value={tempEdit.created_at || ""} 
                  onChange={(e)=>setTempEdit({...tempEdit, created_at: e.target.value})} 
                  className={styles.dateInput}
                />
                <input 
                  type="text" 
                  value={tempEdit.location || ""} 
                  onChange={(e)=>setTempEdit({...tempEdit, location: e.target.value})} 
                  placeholder="場所" 
                />
                <input 
                  type="text" 
                  value={tempEdit.item_name || ""} 
                  onChange={(e)=>setTempEdit({...tempEdit, item_name: e.target.value})} 
                  placeholder="品名" 
                />
                <input 
                  type="number" 
                  value={tempEdit.amount ?? 0} 
                  onChange={(e)=>setTempEdit({...tempEdit, amount: Number(e.target.value)})} 
                  placeholder="金額" 
                />
              </div>
              <div className={styles.editActions}>
                <button onClick={handleUpdate} className={styles.updateBtn}>更新</button>
                <button onClick={() => handleDelete(log.id)} className={styles.deleteBtn}>削除</button>
                <button onClick={() => setEditingId(null)} className={styles.cancelBtn}>戻る</button>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.itemMain}>
                <span className={styles.itemName}>{log.item_name}</span>
                <span className={styles.itemPrice}>¥{(log.amount || 0).toLocaleString()}</span>
              </div>
              <div className={styles.itemSub}>
                <span>{date.getMonth()+1}/{date.getDate()} {date.getHours()}:{date.getMinutes().toString().padStart(2, '0')}</span>
                {log.location && <span className={styles.locationTag}>{log.location}</span>}
              </div>
            </>
          )}
        </div>
      );
    });
    return elements;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoGroup}>
          <span className={styles.logoIcon}>Pocket</span>
          <h1 className={styles.title}>ぽけっとログ</h1>
        </div>
        <div className={styles.statusBadge}>Online</div>
      </header>

      <div className={styles.totalCard}>
        <span className={styles.totalLabel}>今月の総支出</span>
        <h1 className={styles.amount}>¥{monthlyTotal.toLocaleString()}</h1>
      </div>

      <div className={styles.chartsContainer}>
        <div className={styles.chartRow}>
          <div className={styles.chartSection}>
            <span className={styles.chartLabel}>日別の推移</span>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="日付" fontSize={10} tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px'}}
                  itemStyle={{ color: '#22c55e', fontSize: '12px' }}
                />
                <Bar dataKey="金額" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.chartSection}>
            <span className={styles.chartLabel}>支出バランス</span>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={25} outerRadius={40} paddingAngle={5}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.chartSection}>
          <span className={styles.chartLabel}>週間ごとの推移</span>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis dataKey="週" fontSize={12} tick={{fill: '#64748b'}} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="金額" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.inputCard}>
        <button onClick={startListening} className={`${styles.voiceBtn} ${isListening ? styles.voiceBtnActive : ""}`}>
          {isListening ? "音声を聞き取り中..." : "音声で入力する"}
        </button>
        <div className={styles.formGroup}>
          <input type="text" placeholder="場所" value={editData.location || ""} onChange={(e)=>setEditData({...editData, location: e.target.value})} />
          <input type="text" placeholder="品名" value={editData.item_name || ""} onChange={(e)=>setEditData({...editData, item_name: e.target.value})} />
          <input type="number" placeholder="金額" value={editData.amount || ""} onChange={(e)=>setEditData({...editData, amount: Number(e.target.value)})} />
          <button onClick={handleSave} className={styles.saveBtn}>保存</button>
        </div>
      </div>

      <h3 className={styles.historyTitle}>
        履歴と小計 <span style={{fontSize: '0.7rem', fontWeight: 'normal', opacity: 0.6}}>※ダブルクリックで編集</span>
      </h3>
      {renderHistoryWithWeeklySubtotal()}
    </div>
  );
}