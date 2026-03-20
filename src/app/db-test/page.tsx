'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/libs/supabase'
import { useRouter } from 'next/navigation'
import styles from './Task.module.css'

export default function TaskPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showInput, setShowInput] = useState(false)
  
  // 編集状態の管理
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editField, setEditField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  // 入力フォーム用
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [importance, setImportance] = useState('中')
  const [memo, setMemo] = useState('')

  const router = useRouter()

  const fetchTasks = useCallback(async () => {
    const { data } = await supabase.from('tasks').select('*').order('due_date', { ascending: true })
    setTasks(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) router.push('/login')
      else await fetchTasks()
    }
    init()
  }, [router, fetchTasks])

  // インライン編集の保存
  const handleUpdate = async (id: string, field: string, value: any) => {
    const { error } = await supabase.from('tasks').update({ [field]: value }).eq('id', id)
    if (!error) {
      setEditingId(null)
      setEditField(null)
      fetchTasks()
    }
  }

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    await supabase.from('tasks').insert([{ title, due_date: dueDate || null, importance, memo, is_completed: false }])
    setTitle(''); setDueDate(''); setMemo(''); setShowInput(false);
    fetchTasks()
  }

  const toggleComplete = async (id: string, status: boolean) => {
    await supabase.from('tasks').update({ is_completed: !status }).eq('id', id)
    fetchTasks()
  }

  // データを「未完了」と「完了」に分ける
  const activeTasks = tasks.filter(t => !t.is_completed)
  const completedTasks = tasks.filter(t => t.is_completed)

  if (loading) return <div className={styles.loading}>読み込み中...</div>

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h1 className={styles.logo}>TASK<span>Manager</span></h1>
          <div className={styles.controls}>
            <button className={styles.mgmtBtn} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              メニュー {isMenuOpen ? '▲' : '▼'}
            </button>
            {isMenuOpen && (
              <div className={styles.dropdown}>
                <button onClick={() => { setShowInput(!showInput); setIsMenuOpen(false); }}>
                  {showInput ? '閉じる' : '＋ 新規追加'}
                </button>
                <hr className={styles.divider} />
                <button onClick={() => { supabase.auth.signOut(); router.push('/login'); }} className={styles.logoutText}>ログアウト</button>
              </div>
            )}
          </div>
        </header>

        {showInput && (
          <form onSubmit={addTask} className={styles.form}>
            <input type="text" placeholder="何をする？" value={title} onChange={(e) => setTitle(e.target.value)} className={styles.input} required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={styles.input} />
              <select value={importance} onChange={(e) => setImportance(e.target.value)} className={styles.input}>
                <option value="高">重要：高</option>
                <option value="中">重要：中</option>
                <option value="低">重要：低</option>
              </select>
            </div>
            <textarea placeholder="メモ" value={memo} onChange={(e) => setMemo(e.target.value)} className={styles.textarea} />
            <button type="submit" className={styles.addBtn}>タスクを作成する</button>
          </form>
        )}

        {/* 進行中のタスク（カード形式） */}
        <div className={styles.taskGrid}>
          {activeTasks.map(task => (
            <div key={task.id} className={`${styles.taskCard} ${task.importance === '高' ? styles.highCard : ''}`}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className={styles.checkBtn} onClick={() => toggleComplete(task.id, false)}> </button>
                <div style={{ flex: 1 }}>
                  <span className={styles.importanceBadge}>{task.importance}</span>
                  
                  {/* タイトル編集 */}
                  {editingId === task.id && editField === 'title' ? (
                    <input autoFocus className={styles.inlineInput} value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={() => handleUpdate(task.id, 'title', editValue)} onKeyDown={(e) => e.key === 'Enter' && handleUpdate(task.id, 'title', editValue)} />
                  ) : (
                    <h3 className={styles.taskTitle} onDoubleClick={() => { setEditingId(task.id); setEditField('title'); setEditValue(task.title); }}>{task.title}</h3>
                  )}

                  {/* 日付編集 */}
                  {editingId === task.id && editField === 'due_date' ? (
                    <input type="date" autoFocus className={styles.inlineInput} value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={() => handleUpdate(task.id, 'due_date', editValue)} />
                  ) : (
                    <p className={styles.dueDate} onDoubleClick={() => { setEditingId(task.id); setEditField('due_date'); setEditValue(task.due_date || ''); }}>📅 {task.due_date || '期限なし (クリックで設定)'}</p>
                  )}

                  {/* メモ編集 */}
                  {editingId === task.id && editField === 'memo' ? (
                    <textarea autoFocus className={styles.inlineInput} value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={() => handleUpdate(task.id, 'memo', editValue)} />
                  ) : (
                    <div className={styles.memoText} onDoubleClick={() => { setEditingId(task.id); setEditField('memo'); setEditValue(task.memo || ''); }}>{task.memo || 'メモを追加...'}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 完了済みタスク（テーブル形式） */}
        {completedTasks.length > 0 && (
          <div className={styles.completedSection}>
            <h2 className={styles.sectionTitle}>✅ 完了したタスク</h2>
            <table className={styles.completedTable}>
              <thead>
                <tr>
                  <th>状態</th>
                  <th>タイトル</th>
                  <th>期限</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {completedTasks.map(task => (
                  <tr key={task.id}>
                    <td><button className={`${styles.checkBtn} ${styles.checked}`} onClick={() => toggleComplete(task.id, true)}>✓</button></td>
                    <td>{task.title}</td>
                    <td>{task.due_date || '-'}</td>
                    <td><button className={styles.deleteBtn} onClick={() => { if(confirm('消しますか？')) supabase.from('tasks').delete().eq('id', task.id).then(() => fetchTasks()) }}>削除</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}