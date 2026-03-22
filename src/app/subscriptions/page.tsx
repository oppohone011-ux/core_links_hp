'use client';

import { createClient } from '@supabase/supabase-js';
import styles from "./subscriptions.module.css";
import { useEffect, useState } from 'react';

export default function Page() {
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- モーダル用の状態 ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<any>(null);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchData = async () => {
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'active')
      .order('usage_type', { ascending: true });
    
    if (data) setSubs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 新規登録ボタンの処理 ---
  const handleAddNew = () => {
    setEditingSub({
      name: '',
      amount_jpy: 0,
      usage_type: 'プライベート',
      email: '',
      account_name: '',
      withdrawal_day: '',
      bank_name: '',
      site_url: '',
      memo: '',
      status: 'active' // デフォルトをactiveに
    });
    setIsModalOpen(true);
  };

  const handleCancel = async (id: string, name: string) => {
    if (!confirm(`${name} を解約済みにしますか？`)) return;
    const { error } = await supabase.from('subscriptions').update({ status: 'canceled' }).eq('id', id);
    if (error) alert('エラーが発生しました');
    else fetchData();
  };

  const handleDoubleClick = (sub: any) => {
    setEditingSub({ ...sub });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. 現在ログインしているユーザー情報を取得
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("ログインセッションが見つかりません。再ログインしてください。");
      return;
    }

    // 2. 保存するデータに user_id を強制的にセットする
    const dataToSave = {
      ...editingSub,
      user_id: user.id, // ここが超重要！
    };

    if (editingSub.id) {
      // --- 更新 (UPDATE) ---
      // id や created_at は更新対象から外す
      const { id, created_at, ...updateData } = dataToSave;
      const { error } = await supabase
        .from('subscriptions')
        .update(updateData)
        .eq('id', id);

      if (error) alert('保存に失敗しました: ' + error.message);
      else closeAndRefresh();
    } else {
      // --- 新規作成 (INSERT) ---
      const { error } = await supabase
        .from('subscriptions')
        .insert([dataToSave]); // user_id が入ったデータを入れる

      if (error) alert('登録に失敗しました: ' + error.message);
      else closeAndRefresh();
    }
  };

  const closeAndRefresh = () => {
    setIsModalOpen(false);
    fetchData();
  };

  if (loading) return <div className={styles.container}>読み込み中...</div>;

  // 全体の合計
  const totalJpy = subs.reduce((sum, sub) => sum + (sub.amount_jpy || 0), 0);

  // ビジネス利用の合計（sum に sub.amount_jpy を足す）
  const businessTotal = subs
    .filter(s => s.usage_type === 'ビジネス')
    .reduce((sum, sub) => sum + (sub.amount_jpy || 0), 0);

  // プライベート利用の合計
  const privateTotal = subs
    .filter(s => s.usage_type === 'プライベート')
    .reduce((sum, sub) => sum + (sub.amount_jpy || 0), 0);

  return (
    <div className={styles.container}>
      {/* タイトルと新規作成ボタンを横並びに */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className={styles.title} style={{ margin: 0 }}>サブスク管理</h1>
        <button 
          onClick={handleAddNew}
          style={{ background: '#333', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
        >
          ＋ 新規サブスクを追加
        </button>
      </div>

      {/* 合計カード */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '15px', 
        marginBottom: '30px',
        justifyItems: 'center' // カード自体を中央に配置
      }}>
        {/* カードの中身も中央寄せ */}
        <div style={{ background: '#333', color: '#fff', padding: '20px', borderRadius: '12px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', opacity: 0.8, marginBottom: '5px' }}>総月額合計</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>¥{totalJpy.toLocaleString()}</div>
        </div>

        <div style={{ background: '#fff', border: '2px solid #5b3fd7', padding: '20px', borderRadius: '12px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: '#5b3fd7', fontWeight: 'bold', marginBottom: '5px' }}>💼 ビジネス利用</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>¥{businessTotal.toLocaleString()}</div>
        </div>

        <div style={{ background: '#fff', border: '2px solid #2d7a4d', padding: '20px', borderRadius: '12px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: '#2d7a4d', fontWeight: 'bold', marginBottom: '5px' }}>🏠 プライベート</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>¥{privateTotal.toLocaleString()}</div>
        </div>
      </div>

      {/* テーブル */}
      <div className={styles.tableWrapper}>
        <table className={styles.subTable}>
          <thead>
            <tr>
              <th>サービス / アカウント</th>
              <th>区分</th>
              <th>金額</th>
              <th>引落・詳細</th>
              <th>リンク</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((sub) => (
  <tr 
    key={sub.id} 
    onDoubleClick={() => {
      if (typeof window !== 'undefined' && window.innerWidth >= 768) {
        handleDoubleClick(sub);
      }
    }}
    style={{ cursor: typeof window !== 'undefined' && window.innerWidth >= 768 ? 'pointer' : 'default' }}
  >
    {/* 1. サービス名（スマホ用編集ボタン付き） */}
    <td>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <strong style={{ fontSize: '1.1rem' }}>{sub.name}</strong>
          
          {/* 【スマホ版専用】編集はこのボタンをタップした時だけ！ */}
          <button 
            className={styles.mobileEditBtn}
            onClick={(e) => {
              e.stopPropagation(); 
              handleDoubleClick(sub);
            }}
          >
            編集 ✏️
          </button>
        </div>
        
        <div style={{ display: 'flex' }}>
          <span style={{ 
            fontSize: '10px', padding: '2px 8px', borderRadius: '4px', 
            background: '#e6fffa', color: '#2d3748', border: '1px solid #81e6d9', fontWeight: 'bold' 
          }}>利用中</span>
        </div>
        <div style={{ color: '#888', fontSize: '11px', marginTop: '2px' }}>{sub.email}</div>
      </div>
    </td>
    
    {/* 2. 区分 */}
    <td>
      <span className={`${styles.badge} ${sub.usage_type === 'ビジネス' ? styles.business : styles.private}`}>
        {sub.usage_type}
      </span>
    </td>
    
    {/* 3. 金額 */}
    <td><div className={styles.price}>¥{sub.amount_jpy?.toLocaleString()}</div></td>
    
    {/* 4. 引落・詳細 */}
    <td>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ fontWeight: 'bold' }}>🗓 {sub.withdrawal_day}</div>
        <div style={{ fontSize: '11px', color: '#999' }}>🏦 {sub.bank_name}</div>
      </div>
    </td>
    
    {/* 5. リンク */}
    <td>
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        {sub.site_url ? (
          <a 
            href={sub.site_url} 
            target="_blank" 
            rel="noreferrer" 
            style={{ color: '#0070f3', textDecoration: 'none', fontSize: '12px' }}
            onClick={(e) => e.stopPropagation()}
          >
            🔗 公式サイト
          </a>
        ) : (
          <span style={{ color: '#ccc', fontSize: '12px' }}>-</span>
        )}
      </div>
    </td>
    
    {/* 6. 解約ボタン */}
    <td style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            handleCancel(sub.id, sub.name); 
          }} 
          className={styles.cancelBtn}
        >
          解約
        </button>
      </div>
    </td>
  </tr>
))}
          </tbody>
        </table>
      </div>

      {/* --- 編集・新規兼用モーダル --- */}
      {isModalOpen && editingSub && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <form onSubmit={handleSave} style={{ background: '#fff', padding: '30px', borderRadius: '15px', width: '500px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <h2 style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              {editingSub.id ? 'サブスク詳細編集' : '新規サブスク登録'}
            </h2>
            
            <div style={{ display: 'grid', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>サービス名</label>
                <input style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', marginTop: '4px' }} value={editingSub.name || ''} onChange={e => setEditingSub({...editingSub, name: e.target.value})} required />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>金額 (JPY)</label>
                  <input type="number" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', marginTop: '4px' }} value={editingSub.amount_jpy || 0} onChange={e => setEditingSub({...editingSub, amount_jpy: Number(e.target.value)})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>区分</label>
                  <select style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', marginTop: '4px' }} value={editingSub.usage_type || 'プライベート'} onChange={e => setEditingSub({...editingSub, usage_type: e.target.value})}>
                    <option value="ビジネス">ビジネス</option>
                    <option value="プライベート">プライベート</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>登録メールアドレス</label>
                  <input type="email" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', marginTop: '4px' }} value={editingSub.email || ''} onChange={e => setEditingSub({...editingSub, email: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>アカウント名</label>
                  <input style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', marginTop: '4px' }} value={editingSub.account_name || ''} onChange={e => setEditingSub({...editingSub, account_name: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>引落日</label>
                  <input style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', marginTop: '4px' }} value={editingSub.withdrawal_day || ''} onChange={e => setEditingSub({...editingSub, withdrawal_day: e.target.value})} placeholder="例: 毎月27日" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>引落元（銀行/カード）</label>
                  <input style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', marginTop: '4px' }} value={editingSub.bank_name || ''} onChange={e => setEditingSub({...editingSub, bank_name: e.target.value})} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>公式サイトURL</label>
                <input type="url" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', marginTop: '4px' }} value={editingSub.site_url || ''} onChange={e => setEditingSub({...editingSub, site_url: e.target.value})} placeholder="https://..." />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>備考 / メモ</label>
                <textarea rows={3} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', marginTop: '4px', resize: 'none' }} value={editingSub.memo || ''} onChange={e => setEditingSub({...editingSub, memo: e.target.value})} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '25px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', background: '#f5f5f5', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>キャンセル</button>
              <button type="submit" style={{ padding: '10px 20px', background: '#333', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                {editingSub.id ? '変更を保存する' : '新規登録する'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}